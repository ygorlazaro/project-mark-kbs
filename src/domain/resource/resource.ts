import z from "zod";

/**
 * @swagger
 * components:
 *   schemas:
 *     Resource:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         topicId:
 *           type: string
 *         url:
 *           type: string
 *         description:
 *           type: string
 *         type:
 *           type: string
 *           enum: [video, article, pdf]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - topicId
 *         - url
 *         - description
 *         - type
*/
export interface IResource {
    id: string;
    topicId: string;
    url: string;
    description: string;
    type: "video" | "article" | "pdf";
    createdAt: Date;
    updatedAt: Date;
}

export const ResourceSchema = z.object({
    topicId: z.string(),
    url: z.string().url("Invalid URL format"),
    description: z.string(),
    type: z.enum(["video", "article", "pdf"])
});

export type ResourceInput = z.infer<typeof ResourceSchema>;
