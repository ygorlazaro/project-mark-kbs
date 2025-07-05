import express from "express";
import { TopicController } from "../controllers/TopicController";
import { TopicRepository } from "../repositories/TopicRepository";
import { TopicService } from "../services/TopicService";

const router = express.Router();

const topicRepository = new TopicRepository();
const topicService = new TopicService(topicRepository);
const controller = new TopicController(topicService);

router.get("/", controller.list);
router.post("/", controller.create);
router.get("/:id", controller.get);
router.put("/:id", controller.put);
router.delete("/:id", controller.delete);

export default router;
