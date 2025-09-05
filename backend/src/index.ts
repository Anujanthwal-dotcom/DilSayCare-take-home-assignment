import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import scheduleRoutes from "./routes/scheduleRoutes";
import path from 'path';
import { authenticate } from "./middlewares/authMiddleware";
dotenv.config({
  path: path.resolve(__dirname, "../.env")
});


const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/schedules", scheduleRoutes);

app.use('/api/v1/verify', authenticate, (req, res) => {
  res.status(200).json(true);
});


const PORT = process.env.PORT || 3000;


app.use(express.json());




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});