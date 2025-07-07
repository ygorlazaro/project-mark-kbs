import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import topicRoutes from "./domain/topic/topicRoutes";
import userRoutes from "./domain/user/userRoutes";
import resourceRoutes from "./domain/resource/resourceRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import { setupSwagger } from "./config/swagger";

const PORT = process.env.PORT ?? 3000;

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Setup Swagger first
setupSwagger(app);

// API routes
app.use("/api/topic", topicRoutes);
app.use("/api/user", userRoutes);
app.use("/api/resource", resourceRoutes);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Running at ${PORT}`));
