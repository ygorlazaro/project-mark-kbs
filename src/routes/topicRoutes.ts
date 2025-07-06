import express from "express";
import { TopicController } from "../controllers/TopicController";
import { TopicRepository } from "../repositories/TopicRepository";
import { TopicService } from "../services/TopicService";

const router = express.Router();

const topicRepository = new TopicRepository();
const topicService = new TopicService(topicRepository);
const controller = new TopicController(topicService);

/**
 * @swagger
 * /api/topic:
 *   get:
 *     summary: Get all topics
 *     tags: [Topics]
 *     responses:
 *       200:
 *         description: The topic data
 */
router.get("/", controller.list);
/**
 * @swagger
 * /api/topic:
 *   post:
 *     summary: Create a new topic
 *     tags: [Topics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Topic'
 *     responses:
 *       201:
 *         description: Topic created successfully
 */
router.post("/", controller.create);
/**
 * @swagger
 * /api/topic/shortest-path:
 *   get:
 *     summary: Find the shortest path between two topics
 *     tags: [Topics]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *         required: true
 *         description: The starting topic ID
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *         required: true
 *         description: The target topic ID
 *     responses:
 *       200:
 *         description: Shortest path found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Topic'
 *       400:
 *         description: Missing or invalid parameters
 *       404:
 *         description: No path found
 */
router.get("/shortest-path", controller.findShortestPath);
/**
 * @swagger
 * /api/topic/{id}:
 *   get:
 *     summary: Get a topic by ID
 *     tags: [Topics]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The topic ID
 *     responses:
 *       200:
 *         description: The topic data
 *       404:
 *         description: Topic not found
 */
router.get("/:id", controller.get);
/**
 * @swagger
 * /api/topic/{id}:
 *   put:
 *     summary: Update a topic by ID
 *     tags: [Topics]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The topic ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Topic'
 *     responses:
 *       200:
 *         description: Topic updated successfully
 *       400:
 *         description: Validation errors
 *       404:
 *         description: Topic not found
 */
router.put("/:id", controller.put);
/**
 * @swagger
 * /api/topic/{id}:
 *   delete:
 *     summary: Delete a topic by ID
 *     tags: [Topics]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The topic ID
 *     responses:
 *       200:
 *         description: Topic deleted successfully
 *       404:
 *         description: Topic not found
 */
router.delete("/:id", controller.delete);

export default router;
