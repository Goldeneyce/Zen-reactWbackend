import fastify from "fastify";
import { shouldBeAdmin, shouldBeUser } from "../middleware/authMiddleware.js";
import { Order, OrderStatus, PaymentMethod } from "@repo/order-db";
import { startOfMonth, subMonths } from "date-fns";
import { OrderChartType } from "@repo/types";

export const orderRoutes = async (fastify: fastify.FastifyInstance) => {
    fastify.get(
        '/user-orders',
        { preHandler: shouldBeUser },
         async (request, reply) => {
            const orders = await Order.find({ userId: request.userId });
            return reply.status(200).send(orders);
        }
    );
    
    fastify.get('/orders', 
        { preHandler: shouldBeAdmin }, 
        async (request, reply) => {
            const { limit } = request.query as {limit: number};
            const orders = await Order.find().limit(limit).sort({ createdAt: -1 });
            return reply.status(200).send(orders);
        });

    fastify.get(
        '/order-chart', 
        { preHandler: shouldBeAdmin }, 
        async (request, reply) => {
            const now = new Date();
            const sixMonthsAgo = startOfMonth(subMonths(now,5))

            // { month: "January", total: 186, successful: 80 }

            const raw = await Order.aggregate([
                { 
                    $match: { createdAt: { $gte: sixMonthsAgo, $lte: now },}, 
                },
                {
                    $group: {
                        _id: { 
                         year: {$year:"$createdAt"},
                         month: {$month:"$createdAt"},
                        },
                        total: { $sum: 1 },
                        successful: {
                            $sum: {
                                $cond: [{ $eq: ["$status", "success"] }, 1, 0],
                                // {
                                //     "year":2025,
                                //     "month":1,
                                //     "total":100,
                                //     "successful":70
                                // }
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        year: "$_id.year",
                        month: "$_id.month",
                        total: 1,
                        successful: 1,
                    },
                },
                {
                    $sort: { year: 1, month: 1 },
                },
            ]);

            const monthNames = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];

            const results: OrderChartType[] = []

            for (let i =5; i>=0; i--){
                const d = subMonths(now, i);
                const year = d.getFullYear();
                const month = d.getMonth() + 1;

                const match = raw.find(item=> item.year === year && item.month === month);

                results.push({
                    month: monthNames[month -1] as string,
                    total: match ? match.total : 0,
                    successful: match ? match.successful : 0,
                });
            }
            return reply.status(200).send(results);
        }
    );

    // Create a COD (Pay on Delivery) order - status starts as "unpaid"
    fastify.post(
        '/orders/cod',
        { preHandler: shouldBeUser },
        async (request, reply) => {
            const userId = request.userId;
            const body = request.body as any;
            const { email, amount, products, shippingAddress, shippingDetails } = body;

            if (!email || !amount || !products || !shippingAddress) {
                return reply.status(400).send({ error: 'Missing required fields: email, amount, products, shippingAddress' });
            }

            const order = new Order({
                userId,
                email,
                amount,
                status: OrderStatus.UNPAID,
                paymentMethod: PaymentMethod.COD,
                products,
                shippingAddress,
                shippingDetails: shippingDetails || undefined,
            });

            try {
                const savedOrder = await order.save();
                return reply.status(201).send(savedOrder);
            } catch (error) {
                console.log('Error creating COD order:', error);
                return reply.status(500).send({ error: 'Failed to create order' });
            }
        }
    );

    // Mark an order as delivered (admin only)
    fastify.patch(
        '/orders/:id/deliver',
        { preHandler: shouldBeAdmin },
        async (request, reply) => {
            const { id } = request.params as { id: string };

            const order = await Order.findById(id);
            if (!order) {
                return reply.status(404).send({ error: 'Order not found' });
            }

            order.status = OrderStatus.DELIVERED;
            await order.save();
            return reply.status(200).send(order);
        }
    );

    // Mark an order as paid (admin only - for manual payment confirmation)
    fastify.patch(
        '/orders/:id/mark-paid',
        { preHandler: shouldBeAdmin },
        async (request, reply) => {
            const { id } = request.params as { id: string };

            const order = await Order.findById(id);
            if (!order) {
                return reply.status(404).send({ error: 'Order not found' });
            }

            order.status = OrderStatus.PAID;
            await order.save();
            return reply.status(200).send(order);
        }
    );

    // Pay for a delivered COD order (user-facing)
    fastify.patch(
        '/orders/:id/pay',
        { preHandler: shouldBeUser },
        async (request, reply) => {
            const { id } = request.params as { id: string };
            const userId = request.userId;

            const order = await Order.findById(id);
            if (!order) {
                return reply.status(404).send({ error: 'Order not found' });
            }

            if (order.userId !== userId) {
                return reply.status(403).send({ error: 'Unauthorized' });
            }

            if (order.paymentMethod !== PaymentMethod.COD) {
                return reply.status(400).send({ error: 'This order was not placed with Pay on Delivery' });
            }

            if (order.status !== OrderStatus.DELIVERED) {
                return reply.status(400).send({ error: 'Order must be delivered before payment can be made' });
            }

            order.status = OrderStatus.PAID;
            await order.save();
            return reply.status(200).send(order);
        }
    );
};
