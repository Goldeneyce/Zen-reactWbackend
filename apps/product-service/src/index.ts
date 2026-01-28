import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import productRouter from "./routes/product.route.js";
import productSpecificationRouter from "./routes/productSpecification.route.js";
import categoryRouter from "./routes/category.route.js";
import { consumer, producer } from "./utils/kafka.ts";

const app = express();
app.use(
	cors({
		origin: [
			"http://localhost:3002", 
			"http://localhost:3003", 
			"http://localhost:3004",
			"http://192.168.0.152:3002",
			"http://192.168.0.152:3003",
			"http://192.168.0.152:3004"
		],
		credentials: true,
	})
);
app.use(express.json());
app.use(clerkMiddleware());

app.get("/health", (req: Request, res: Response) => {
	return res.status(200).json({
		status: "ok",
		uptime: process.uptime(),
		timestamp: Date.now(),
	});
});

app.get("/test", shouldBeUser, (req: Request, res: Response) => {
	
	return res.status(200).json({
		message: "Product service authenticated successfully",
		userId: req.userId,
	});
});

app.use("/products", productRouter);
app.use("/productSpecification", productSpecificationRouter);
app.use("/categories", categoryRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	console.log(err);
	return res.status(err.status || 500).json({
		message: err.message || "Internal Server Error",
	});
});

const start = async () => {
	try {
		await Promise.all([consumer.connect(), producer.connect()]);
		app.listen(8000, "0.0.0.0", () => {
			console.log("Product service listening on port 8000");
		});
	} catch (error) {
		console.error("Error connecting to Kafka:", error);
		process.exit(1);
	}
};

start();