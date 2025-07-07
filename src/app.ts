import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import topicRoutes from "./domain/topic/topicRoutes";
import userRoutes from "./domain/user/userRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import { authenticateJWT } from "./middlewares/auth";
import { setupSwagger } from "./config/swagger";

const PORT = process.env.PORT ?? 3000;

const app = express();

app.use(bodyParser.json());
app.use(cors());


app.use("/api/topic", topicRoutes);
app.use("/api/user", userRoutes);

setupSwagger(app);

app.use((req, res, next) => {
    if ((req.method === "GET" && req.path.startsWith("/swagger")) ||
        (req.method === "POST" && req.path === "/api/user")) {
        return next("route");
    }

    next();
});

app.use(errorHandler);
app.use(authenticateJWT);


app.listen(PORT, () => console.log(`Running at ${PORT}`));
