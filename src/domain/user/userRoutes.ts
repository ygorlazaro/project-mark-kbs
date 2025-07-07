import express from "express";
import { UserController } from "./userController";
import { UserRepository } from "./userRepository";
import { UserService } from "./userService";
import { UserDataStore } from "./userDataStore";

const router = express.Router();

const userData = new UserDataStore();
const userRepository = new UserRepository(userData);
const userService = new UserService(userRepository);
const controller = new UserController(userService);

/**
 * @openapi
 * /api/user:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 */
router.post("/", controller.create);

/**
 * @openapi
 * /api/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get("/:id", controller.findById);

export default router;
