import { serve } from "@hono/node-server";
import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { cors } from "hono/cors";
import { shouldBeAdmin } from "./middleware/authMiddleware.js";
import userRoute from "./routes/user.route.js";
import { producer } from "./utils/kafka.ts";

const app = new Hono();
app.use(
	"*",
	cors({
		origin: [
			"http://localhost:3003",
			"http://192.168.0.152:3003",
		],
		credentials: true,
	})
);

app.get("/health", (c) => {
	return c.json({
		status: "ok",
		uptime: process.uptime(),
		timestamp: Date.now(),
	});
});

app.route("/users", shouldBeAdmin, userRoute);

app.onError((err, c) => {
	console.log(err);
	const status = ((err as { status?: number })?.status ?? 500) as ContentfulStatusCode;
	return c.json(
		{
			message: (err as Error)?.message || "Internal Server Error",
		},
		status
	);
});

const start = async () => {
	try {
		await producer.connect();
		
		serve(
			{
				fetch: app.fetch,
				port: 8003,
				hostname: "0.0.0.0",
			},
			(info) => {
				console.log(`Auth service listening on ${info.address}:${info.port}`);
			}
		);
	} catch (error) {
		console.error("Error connecting to Kafka:", error);
		process.exit(1);
	}
};

start();