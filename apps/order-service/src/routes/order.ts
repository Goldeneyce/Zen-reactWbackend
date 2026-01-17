import fastify from "fastify";
import { shouldBeAdmin, shouldBeUser } from "../middleware/authMiddleware.js";
import { Order } from "@repo/order-db";

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
            const orders = await Order.find({});
            return reply.status(200).send(orders);
        });
};
