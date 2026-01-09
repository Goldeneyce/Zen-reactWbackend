import express, {Request, Response} from "express"
import cors from "cors";

const app = express();
app.use(cors({
    origin: ["http://localhost:3003","http://localhost:3004"],
    credentials: true, // adjust this to your client URL
}));

app.get("/health", (req: Request, res: Response)=>{
  return res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});
app.listen(8000, ()=>{
  console.log("Product service is running on port 8000");
})