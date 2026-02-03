import fastify from "fastify";
import { shouldBeAdmin, shouldBeUser } from "../middleware/authMiddleware.js";
import { Order } from "@repo/order-db";
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
};
