import express from "express";
import { ResourceController } from "./resourceController";
import { ResourceRepository } from "./resourceRepository";
import { ResourceService } from "./resourceService";
import { ResourceDataStore } from "./resourceDataStore";

const router = express.Router();

const dataResource = new ResourceDataStore();
const resourceRepository = new ResourceRepository(dataResource);
const resourceService = new ResourceService(resourceRepository);
const controller = new ResourceController(resourceService);

/**
 * @swagger
 * /api/resource:
 *   get:
 *     summary: Get all resources
 *     tags: [Resources]
 *     responses:
 *       200:
 *         description: The resource data
 */
router.get("/", controller.findAll);
/**
 * @swagger
 * /api/resource:
 *   post:
 *     summary: Create a new resource
 *     tags: [Resources]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Resource'
 *     responses:
 *       201:
 *         description: Resource created successfully
 */
router.post("/", controller.create);
/**
 * @swagger
 * /api/resource/{id}:
 *   get:
 *     summary: Get a resource by ID
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The resource ID
 *     responses:
 *       200:
 *         description: The resource data
 *       404:
 *         description: Resource not found
 */
router.get("/:id", controller.findById);
/**
 * @swagger
 * /api/resource/{id}:
 *   put:
 *     summary: Update a resource by ID
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The resource ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Resource'
 *     responses:
 *       200:
 *         description: Resource updated successfully
 *       400:
 *         description: Validation errors
 *       404:
 *         description: Resource not found
 */
router.put("/:id", controller.update);
/**
 * @swagger
 * /api/resource/{id}:
 *   delete:
 *     summary: Delete a resource by ID
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The resource ID
 *     responses:
 *       200:
 *         description: Resource deleted successfully
 *       404:
 *         description: Resource not found
 */
router.delete("/:id", controller.delete);
/**
 * @swagger
 * /api/resource/topic/{topicId}:
 *   get:
 *     summary: Get all resources for a topic
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: topicId
 *         schema:
 *           type: string
 *         required: true
 *         description: The topic ID
 *     responses:
 *       200:
 *         description: The resources for the topic
 */
router.get("/topic/:topicId", controller.listByTopic);

export default router;
