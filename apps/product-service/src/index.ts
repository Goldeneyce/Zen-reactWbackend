import express from "express"
import cors from "cors";

const app = express();
app.use(cors({
    origin: ["http://localhost:3003","http://localhost:3004"],
    credentials: true, // adjust this to your client URL
}))

app.listen(8000, ()=>{
  console.log("Product service is running on port 8000");
})