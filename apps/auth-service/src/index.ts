import fastify, { type FastifyError } from "fastify";
import cors from "@fastify/cors";
import { shouldBeAdmin } from "./middleware/authMiddleware.js";
import userRoute from "./routes/user.route.js";
import { producer } from "./utils/kafka.ts";

const app = fastify({
	logger: true,
});

await app.register(cors, {
	origin: [
		"http://localhost:3003",
		"http://192.168.0.152:3003",
		...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : []),
	],
	credentials: true,
});

app.get("/health", async (request, reply) => {
	return reply.send({
		status: "ok",
		uptime: process.uptime(),
		timestamp: Date.now(),
	});
});

app.register(userRoute, { prefix: "/users" });

app.setErrorHandler((error: FastifyError, request, reply) => {
	console.log(error);
	const status = error.statusCode ?? 500;
	reply.status(status).send({
		message: error.message || "Internal Server Error",
	});
});

const start = async () => {
	try {
		await producer.connect();
		
		await app.listen({
			port: Number(process.env.PORT ?? 8003),
			host: "0.0.0.0",
		});
		
		console.log(`Auth service listening on 0.0.0.0:${process.env.PORT ?? 8003}`);
	} catch (error) {
		console.error("Error starting server:", error);
		process.exit(1);
	}
};

start();