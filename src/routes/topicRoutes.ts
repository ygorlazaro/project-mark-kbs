import express from "express";
import { TopicController } from "../controllers/TopicController";
import { TopicRepository } from "../repositories/TopicRepository";
import { TopicService } from "../services/TopicService";

const router = express.Router();

const topicRepository = new TopicRepository();
const topicService = new TopicService(topicRepository);
const controller = new TopicController(topicService);

router.post("/", controller.create);
router.get("/:id", controller.get);
// router.get('/:id/tree', (req, res) => res.send('Get topic tree'));
// router.get('/:id/version/:version', (req, res) => res.send('Get topic version'));
// router.get('/shortest-path', (req, res) => res.send('Get shortest path'));

export default router;
