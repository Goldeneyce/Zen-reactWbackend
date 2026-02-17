import fastify from "fastify";
import { shouldBeAdmin } from "../middleware/authMiddleware.js";
import {
  Order, OrderStatus, OrderActivity, ReturnRequest, ReturnStatus, NoteType,
} from "@repo/order-db";
import { startOfDay, subDays, startOfMonth, subMonths, format } from "date-fns";

export const orderAdminRoutes = async (fastify: fastify.FastifyInstance) => {

  // ─── Dashboard Stats ────────────────────────────────────────
  fastify.get(
    '/admin/orders/stats',
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const today = startOfDay(new Date());

      const [totalAgg, todayAgg, statusCounts] = await Promise.all([
        Order.aggregate([
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalRevenue: { $sum: '$amount' },
              avgOrderValue: { $avg: '$amount' },
            },
          },
        ]),
        Order.aggregate([
          { $match: { createdAt: { $gte: today } } },
          {
            $group: {
              _id: null,
              todayOrders: { $sum: 1 },
              todayRevenue: { $sum: '$amount' },
            },
          },
        ]),
        Order.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
      ]);

      const total = totalAgg[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 };
      const todayData = todayAgg[0] || { todayOrders: 0, todayRevenue: 0 };

      const statusMap: Record<string, number> = {};
      statusCounts.forEach((s: any) => { statusMap[s._id] = s.count; });

      return reply.send({
        totalOrders: total.totalOrders,
        totalRevenue: total.totalRevenue,
        avgOrderValue: Math.round(total.avgOrderValue || 0),
        todayOrders: todayData.todayOrders,
        todayRevenue: todayData.todayRevenue,
        pendingOrders: (statusMap['pending'] || 0) + (statusMap['processing'] || 0) + (statusMap['unpaid'] || 0),
        completedOrders: (statusMap['completed'] || 0) + (statusMap['delivered'] || 0) + (statusMap['paid'] || 0),
        cancelledOrders: statusMap['cancelled'] || 0,
        refundedOrders: (statusMap['refunded'] || 0) + (statusMap['partially_refunded'] || 0),
      });
    }
  );

  // ─── Revenue by Day (last 30 days) ──────────────────────────
  fastify.get(
    '/admin/orders/revenue-by-day',
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const thirtyDaysAgo = subDays(new Date(), 30);

      const raw = await Order.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$amount' },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const results = raw.map((r: any) => ({
        date: r._id,
        revenue: r.revenue,
        orders: r.orders,
      }));

      return reply.send(results);
    }
  );

  // ─── Status Distribution ────────────────────────────────────
  fastify.get(
    '/admin/orders/status-distribution',
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const raw = await Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);
      return reply.send(raw.map((r: any) => ({ status: r._id, count: r.count })));
    }
  );

  // ─── Get All Orders (with search/filter/pagination) ─────────
  fastify.get(
    '/admin/orders',
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const {
        page = 1,
        limit = 20,
        status,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        startDate,
        endDate,
        paymentMethod,
        priority,
        minAmount,
        maxAmount,
      } = request.query as any;

      const filter: any = {};
      if (status && status !== 'all') filter.status = status;
      if (paymentMethod && paymentMethod !== 'all') filter.paymentMethod = paymentMethod;
      if (priority && priority !== 'all') filter.priority = priority;
      if (search) {
        filter.$or = [
          { email: { $regex: search, $options: 'i' } },
          { _id: search.length === 24 ? search : undefined },
          { 'shippingDetails.fullName': { $regex: search, $options: 'i' } },
        ].filter(Boolean);
      }
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }
      if (minAmount || maxAmount) {
        filter.amount = {};
        if (minAmount) filter.amount.$gte = Number(minAmount);
        if (maxAmount) filter.amount.$lte = Number(maxAmount);
      }

      const skip = (Number(page) - 1) * Number(limit);
      const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

      const [orders, total] = await Promise.all([
        Order.find(filter).sort(sort).skip(skip).limit(Number(limit)),
        Order.countDocuments(filter),
      ]);

      return reply.send({
        orders,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      });
    }
  );

  // ─── Get Single Order (full detail) ─────────────────────────
  fastify.get(
    '/admin/orders/:id',
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const order = await Order.findById(id);
      if (!order) return reply.status(404).send({ error: 'Order not found' });
      return reply.send(order);
    }
  );

  // ─── Update Order (edit) ────────────────────────────────────
  fastify.patch(
    '/admin/orders/:id',
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const body = request.body as any;
      const order = await Order.findById(id);
      if (!order) return reply.status(404).send({ error: 'Order not found' });

      const oldStatus = order.status;
      const updatableFields = [
        'status', 'email', 'amount', 'shippingAddress', 'shippingDetails',
        'products', 'paymentMethod', 'adminNotes', 'tags', 'priority', 'assignedTo',
        'fraudAnalysis',
      ];

      updatableFields.forEach((field) => {
        if (body[field] !== undefined) {
          (order as any)[field] = body[field];
        }
      });

      await order.save();

      // Log status change
      if (body.status && body.status !== oldStatus) {
        await OrderActivity.create({
          orderId: id,
          action: 'status_changed',
          description: `Status changed from "${oldStatus}" to "${body.status}"`,
          performedBy: request.userId || 'admin',
          noteType: NoteType.SYSTEM,
        });
      }

      // Log general edit
      await OrderActivity.create({
        orderId: id,
        action: 'order_updated',
        description: `Order updated by admin`,
        performedBy: request.userId || 'admin',
        noteType: NoteType.SYSTEM,
        metadata: { fieldsChanged: Object.keys(body) },
      });

      return reply.send(order);
    }
  );

  // ─── Update Order Status ────────────────────────────────────
  fastify.patch(
    '/admin/orders/:id/status',
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { status, reason } = request.body as { status: string; reason?: string };

      const order = await Order.findById(id);
      if (!order) return reply.status(404).send({ error: 'Order not found' });

      const oldStatus = order.status;
      order.status = status as any;
      await order.save();

      await OrderActivity.create({
        orderId: id,
        action: 'status_changed',
        description: `Status changed from "${oldStatus}" to "${status}"${reason ? `: ${reason}` : ''}`,
        performedBy: request.userId || 'admin',
        noteType: NoteType.SYSTEM,
      });

      return reply.send(order);
    }
  );

  // ─── Mark as Paid (manual) ──────────────────────────────────
  fastify.patch(
    '/admin/orders/:id/mark-paid',
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { notes } = request.body as { notes?: string } || {};

      const order = await Order.findById(id);
      if (!order) return reply.status(404).send({ error: 'Order not found' });

      order.status = OrderStatus.PAID as any;
      await order.save();

      await OrderActivity.create({
        orderId: id,
        action: 'marked_paid',
        description: `Order manually marked as paid${notes ? `: ${notes}` : ''}`,
        performedBy: request.userId || 'admin',
        noteType: NoteType.SYSTEM,
      });

      return reply.send(order);
    }
  );

  // ─── Fraud Analysis ─────────────────────────────────────────
  fastify.patch(
    '/admin/orders/:id/fraud',
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const body = request.body as any;

      const order = await Order.findById(id);
      if (!order) return reply.status(404).send({ error: 'Order not found' });

      order.fraudAnalysis = {
        ...(order.fraudAnalysis || {}),
        ...body,
        reviewedBy: request.userId || 'admin',
        reviewedAt: new Date(),
      } as any;
      await order.save();

      await OrderActivity.create({
        orderId: id,
        action: 'fraud_review',
        description: `Fraud analysis updated: risk level "${body.riskLevel || 'unchanged'}"`,
        performedBy: request.userId || 'admin',
        noteType: NoteType.INTERNAL,
      });

      return reply.send(order);
    }
  );

  // ─── Activity Log / Timeline ────────────────────────────────
  fastify.get(
    '/admin/orders/:id/activity',
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const activities = await OrderActivity.find({ orderId: id }).sort({ createdAt: -1 });
      return reply.send(activities);
    }
  );

  // ─── Add Note / Comment ─────────────────────────────────────
  fastify.post(
    '/admin/orders/:id/notes',
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { description, noteType = NoteType.INTERNAL } = request.body as any;

      const activity = await OrderActivity.create({
        orderId: id,
        action: 'note_added',
        description,
        performedBy: request.userId || 'admin',
        noteType,
      });

      return reply.status(201).send(activity);
    }
  );

  // ─── Return Requests ────────────────────────────────────────
  fastify.get(
    '/admin/returns',
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const { page = 1, limit = 20, status, type } = request.query as any;
      const filter: any = {};
      if (status && status !== 'all') filter.status = status;
      if (type && type !== 'all') filter.type = type;

      const skip = (Number(page) - 1) * Number(limit);
      const [returns, total] = await Promise.all([
        ReturnRequest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
        ReturnRequest.countDocuments(filter),
      ]);

      return reply.send({ returns, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
    }
  );

  fastify.get(
    '/admin/returns/:id',
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const returnReq = await ReturnRequest.findById(id);
      if (!returnReq) return reply.status(404).send({ error: 'Return request not found' });
      return reply.send(returnReq);
    }
  );

  // Get returns for a specific order
  fastify.get(
    '/admin/orders/:id/returns',
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const returns = await ReturnRequest.find({ orderId: id }).sort({ createdAt: -1 });
      return reply.send(returns);
    }
  );

  // Create return request (admin-initiated)
  fastify.post(
    '/admin/returns',
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const body = request.body as any;
      const returnReq = await ReturnRequest.create({
        ...body,
        processedBy: request.userId || 'admin',
      });

      await OrderActivity.create({
        orderId: body.orderId,
        action: 'return_created',
        description: `${body.type} request created: ${body.reason}`,
        performedBy: request.userId || 'admin',
        noteType: NoteType.SYSTEM,
      });

      return reply.status(201).send(returnReq);
    }
  );

  // Update return request status
  fastify.patch(
    '/admin/returns/:id',
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const body = request.body as any;

      const returnReq = await ReturnRequest.findById(id);
      if (!returnReq) return reply.status(404).send({ error: 'Return request not found' });

      const oldStatus = returnReq.status;
      Object.assign(returnReq, body);
      if (body.status && body.status !== oldStatus) {
        returnReq.processedBy = request.userId || 'admin';
        returnReq.processedAt = new Date();
      }
      await returnReq.save();

      await OrderActivity.create({
        orderId: returnReq.orderId,
        action: 'return_updated',
        description: `Return ${returnReq.type} status changed from "${oldStatus}" to "${body.status || oldStatus}"`,
        performedBy: request.userId || 'admin',
        noteType: NoteType.SYSTEM,
      });

      // If refunded, update order status
      if (body.status === ReturnStatus.REFUNDED) {
        const order = await Order.findById(returnReq.orderId);
        if (order) {
          order.status = (returnReq.refundAmount || 0) >= order.amount
            ? (OrderStatus.REFUNDED as any)
            : (OrderStatus.PARTIALLY_REFUNDED as any);
          await order.save();
        }
      }

      return reply.send(returnReq);
    }
  );

  // ─── Bulk Actions ───────────────────────────────────────────
  fastify.post(
    '/admin/orders/bulk-status',
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const { orderIds, status, reason } = request.body as {
        orderIds: string[];
        status: string;
        reason?: string;
      };

      const result = await Order.updateMany(
        { _id: { $in: orderIds } },
        { $set: { status } }
      );

      // Log for each order
      await Promise.all(
        orderIds.map((orderId) =>
          OrderActivity.create({
            orderId,
            action: 'bulk_status_change',
            description: `Bulk status change to "${status}"${reason ? `: ${reason}` : ''}`,
            performedBy: request.userId || 'admin',
            noteType: NoteType.SYSTEM,
          })
        )
      );

      return reply.send({ modified: result.modifiedCount });
    }
  );

  // ─── Top-level Reporting ────────────────────────────────────
  fastify.get(
    '/admin/orders/report/monthly',
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const { months = 12 } = request.query as any;
      const startDate = startOfMonth(subMonths(new Date(), Number(months) - 1));

      const raw = await Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$amount' },
            avgOrderValue: { $avg: '$amount' },
            completedOrders: {
              $sum: { $cond: [{ $in: ['$status', ['completed', 'delivered', 'paid']] }, 1, 0] },
            },
            cancelledOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
            },
            refundedOrders: {
              $sum: { $cond: [{ $in: ['$status', ['refunded', 'partially_refunded']] }, 1, 0] },
            },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]);

      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ];

      const results = raw.map((r: any) => ({
        month: `${monthNames[r._id.month - 1]} ${r._id.year}`,
        totalOrders: r.totalOrders,
        totalRevenue: r.totalRevenue,
        avgOrderValue: Math.round(r.avgOrderValue),
        completedOrders: r.completedOrders,
        cancelledOrders: r.cancelledOrders,
        refundedOrders: r.refundedOrders,
      }));

      return reply.send(results);
    }
  );

  // Payment method breakdown
  fastify.get(
    '/admin/orders/report/payment-methods',
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const raw = await Order.aggregate([
        {
          $group: {
            _id: '$paymentMethod',
            count: { $sum: 1 },
            totalRevenue: { $sum: '$amount' },
          },
        },
        { $sort: { count: -1 } },
      ]);
      return reply.send(raw.map((r: any) => ({
        method: r._id || 'card',
        count: r.count,
        totalRevenue: r.totalRevenue,
      })));
    }
  );

  // Top customers
  fastify.get(
    '/admin/orders/report/top-customers',
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const { limit = 10 } = request.query as any;
      const raw = await Order.aggregate([
        {
          $group: {
            _id: '$email',
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: '$amount' },
            lastOrder: { $max: '$createdAt' },
          },
        },
        { $sort: { totalSpent: -1 } },
        { $limit: Number(limit) },
      ]);
      return reply.send(raw.map((r: any) => ({
        email: r._id,
        totalOrders: r.totalOrders,
        totalSpent: r.totalSpent,
        lastOrder: r.lastOrder,
      })));
    }
  );

  // Returns summary
  fastify.get(
    '/admin/returns/stats',
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const [statusCounts, typeCounts, totalRefunded] = await Promise.all([
        ReturnRequest.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        ReturnRequest.aggregate([
          { $group: { _id: '$type', count: { $sum: 1 } } },
        ]),
        ReturnRequest.aggregate([
          { $match: { status: ReturnStatus.REFUNDED } },
          { $group: { _id: null, total: { $sum: '$refundAmount' } } },
        ]),
      ]);

      return reply.send({
        byStatus: statusCounts.map((r: any) => ({ status: r._id, count: r.count })),
        byType: typeCounts.map((r: any) => ({ type: r._id, count: r.count })),
        totalRefunded: totalRefunded[0]?.total || 0,
      });
    }
  );
};
