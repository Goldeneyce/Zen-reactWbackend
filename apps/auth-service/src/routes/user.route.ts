import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import supabase from "../utils/supabase.ts";
import { producer } from "../utils/kafka.ts";
import { shouldBeAdmin } from "../middleware/authMiddleware.js";

export default async function userRoute(fastify: FastifyInstance) {
    // Apply admin middleware to all routes in this plugin
    fastify.addHook("onRequest", shouldBeAdmin);

    fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
        const users = await supabase.supabaseClient.auth.admin.listUsers();
        return reply.send(users);
    });

    fastify.get<{
        Params: { id: string };
    }>("/:id", async (request, reply) => {
        const { id } = request.params;
        const { data: user, error } = await supabase.supabaseClient.auth.admin.getUserById(id);
        if (error) {
            return reply.status(404).send({ message: "User not found", error });
        }
        return reply.send(user);
    });

    fastify.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
        const newUser = request.body as any;
        const { data: user, error } = await supabase.supabaseClient.auth.admin.createUser(newUser);
        
        if (error) {
            return reply.status(400).send({ message: "Failed to create user", error });
        }

        await producer.send("user.created", {
            value: JSON.stringify({
                username: user.user?.email?.split('@')[0],
                email: user.user?.email,
            }),
        });

        return reply.send(user);
    });

    fastify.delete<{
        Params: { id: string };
    }>("/:id", async (request, reply) => {
        const { id } = request.params;
        const { data: user, error } = await supabase.supabaseClient.auth.admin.deleteUser(id);
        
        if (error) {
            return reply.status(400).send({ message: "Failed to delete user", error });
        }
        
        return reply.send(user);
    });
}