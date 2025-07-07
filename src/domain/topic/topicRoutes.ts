import express from "express";
import { TopicController } from "./topicController";
import { TopicRepository } from "./topicRepository";
import { TopicService } from "./topicService";
import { TopicDataStore } from "./topicDataStore";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = express.Router();

const dataTopic = new TopicDataStore();
const topicRepository = new TopicRepository(dataTopic);
const topicService = new TopicService(topicRepository);
const controller = new TopicController(topicService);

/**
 * @swagger
 * tags:
 *   name: Topics
 *   description: Topic management
 */

/**
 * @swagger
 * /api/topic:
 *   get:
 *     summary: Get all topics
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 */
router.get("/", authMiddleware(["Admin", "Editor", "Viewer"]), controller.findAll);

/**
 * @swagger
 * /api/topic/shortest-path:
 *   get:
 *     summary: Find the shortest path between two topics
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: endId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         description: Invalid input
 */
router.get("/shortest-path", authMiddleware(["Admin", "Editor", "Viewer"]), controller.findShortestPath);

/**
 * @swagger
 * /api/topic/{id}:
 *   get:
 *     summary: Get a topic by ID
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful operation
 *       404:
 *         description: Topic not found
 */
router.get("/:id", authMiddleware(["Admin", "Editor", "Viewer"]), controller.findById);

/**
 * @swagger
 * /api/topic:
 *   post:
 *     summary: Create a new topic
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Topic'
 *     responses:
 *       201:
 *         description: Topic created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", authMiddleware(["Admin", "Editor"]), controller.create);

/**
 * @swagger
 * /api/topic/{id}:
 *   put:
 *     summary: Update a topic
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *         description: Invalid input
 *       404:
 *         description: Topic not found
 */
router.put("/:id", authMiddleware(["Admin", "Editor"]), controller.update);

/**
 * @swagger
 * /api/topic/{id}:
 *   delete:
 *     summary: Delete a topic
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Topic deleted successfully
 *       404:
 *         description: Topic not found
 */
router.delete("/:id", authMiddleware(["Admin", "Editor"]), controller.delete);

export default router;
