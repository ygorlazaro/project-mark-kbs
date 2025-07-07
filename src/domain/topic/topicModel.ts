import z from "zod";
import { BaseModel } from "../../abstracts/baseModel";

/**
 * @swagger
 * components:
 *   schemas:
 *     Topic:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the topic
 *         content:
 *           type: string
 *           description: Content of the topic
 *         version:
 *           type: integer
 *           description: Version number of the topic
 *         parentTopicId:
 *           type: integer
 *           description: Optional ID of the parent topic for hierarchy
 *       required:
 *         - name
 *         - content
 *         - createdAt
 *         - updatedAt
 *         - version
*/
export class TopicModel extends BaseModel {
    name: string = "";
    content: string = "";
    version: number = 1;
        parentTopicId?: number;
}

export const TopicSchema = z.object({
    name: z.string().min(1, "Name is required"),
    content: z.string().min(1, "Content is required"),
    version: z.number().int(),
        parentTopicId: z.number().int().optional(),
});
