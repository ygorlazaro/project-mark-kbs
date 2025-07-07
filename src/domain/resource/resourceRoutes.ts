import { Router } from "express";
import { ResourceController } from "./resourceController";
import { ResourceRepository } from "./resourceRepository";
import { ResourceService } from "./resourceService";
import { ResourceDataStore } from "./resourceDataStore";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

const dataResource = new ResourceDataStore();
const resourceRepository = new ResourceRepository(dataResource);
const resourceService = new ResourceService(resourceRepository);
const controller = new ResourceController(resourceService);

/**
 * @swagger
 * tags:
 *   name: Resources
 *   description: Resource management
 */

/**
 * @swagger
 * /api/resource:
 *   get:
 *     summary: Get all resources
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 */
router.get("/", authMiddleware(["Admin", "Editor", "Viewer"]), controller.findAll);

/**
 * @swagger
 * /api/resource/topic/{topicId}:
 *   get:
 *     summary: Get all resources for a specific topic
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 */
router.get("/topic/:topicId", authMiddleware(["Admin", "Editor", "Viewer"]), controller.listByTopic);

/**
 * @swagger
 * /api/resource/{id}:
 *   get:
 *     summary: Get a resource by ID
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *       404:
 *         description: Resource not found
 */
router.get("/:id", authMiddleware(["Admin", "Editor", "Viewer"]), controller.findById);

/**
 * @swagger
 * /api/resource:
 *   post:
 *     summary: Create a new resource
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResourceCreate'
 *     responses:
 *       201:
 *         description: Resource created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", authMiddleware(["Admin", "Editor"]), controller.create);

/**
 * @swagger
 * /api/resource/{id}:
 *   put:
 *     summary: Update a resource
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResourceUpdate'
 *     responses:
 *       200:
 *         description: Resource updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Resource not found
 */
router.put("/:id", authMiddleware(["Admin", "Editor"]), controller.update);

/**
 * @swagger
 * /api/resource/{id}:
 *   delete:
 *     summary: Delete a resource
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Resource deleted successfully
 *       404:
 *         description: Resource not found
 */
router.delete("/:id", authMiddleware(["Admin", "Editor"]), controller.delete);

export default router;
