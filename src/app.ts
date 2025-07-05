import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import topicRoutes from "./routes/topicRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const PORT = process.env.PORT ?? 3000;

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/api/topic", topicRoutes);
app.use("/api/user", userRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Running at ${PORT}`));
