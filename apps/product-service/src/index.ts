import { serve } from "@hono/node-server";
import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { cors } from "hono/cors";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import productRouter from "./routes/product.route.js";
import productSpecificationRouter from "./routes/productSpecification.route.js";
import categoryRouter from "./routes/category.route.js";
import { consumer, producer } from "./utils/kafka.ts";

const app = new Hono();
app.use(
	"*",
	cors({
		origin: [
			"http://localhost:3002",
			"http://localhost:3003",
			"http://localhost:3004",
			"http://192.168.0.152:3002",
			"http://192.168.0.152:3003",
			"http://192.168.0.152:3004",
			...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : []),
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

app.get("/test", shouldBeUser, (c) => {
	return c.json({
		message: "Product service authenticated successfully",
		userId: c.get("userId"),
	});
});

app.route("/products", productRouter);
app.route("/productSpecification", productSpecificationRouter);
app.route("/categories", categoryRouter);

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
		await Promise.all([consumer.connect(), producer.connect()]);
		serve(
			{
				fetch: app.fetch,
				port: Number(process.env.PORT ?? 8000),
				hostname: "0.0.0.0",
			},
			(info) => {
				console.log(`Product service listening on ${info.address}:${info.port}`);
			}
		);
	} catch (error) {
		console.error("Error connecting to Kafka:", error);
		process.exit(1);
	}
};

start();