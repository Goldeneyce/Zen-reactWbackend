import express, {Request, Response} from "express"
import cors from "cors";
import { clerkMiddleware, getAuth } from '@clerk/express'
import { shouldBeUser } from "./middleware/authMiddleware.js";
import productRouter from "./routes/product.route.js";
import categoryRouter from "./routes/category.route.js";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3003","http://localhost:3004"],
    credentials: true, // adjust this to your client URL
  })
);
app.use(express.json());
app.use(clerkMiddleware());

app.get("/health", (req: Request, res: Response)=>{
  return res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.get("/test", shouldBeUser, (req: Request, res: Response)=>{
  
  return res.status(200).json({
    message: "Product service authenticated successfully", userId: req.userId });
  });

  app.use("/products", productRouter)
  app.use("/categories", categoryRouter)

app.listen(8000, ()=>{
  console.log("Product service is running on port 8000");
})