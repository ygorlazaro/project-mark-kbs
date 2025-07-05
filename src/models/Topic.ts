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
 *           type: string
 *           description: Optional ID of the parent topic for hierarchy
 *       required:
 *         - name
 *         - content
 *         - createdAt
 *         - updatedAt
 *         - version
*/
export interface ITopic {
    id: string;
    name: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    version: number;
    parentTopicId?: string;
}
