import z from "zod";
import { BaseModel } from "../../abstracts/baseModel";

/**
 * @swagger
 * components:
 *   schemas:
 *     Resource:
 *       type: object
 *       properties:
 *         topicId:
 *           type: integer
 *         url:
 *           type: string
 *         description:
 *           type: string
 *         type:
 *           type: string
 *           enum: [video, article, pdf]
 *       required:
 *         - topicId
 *         - url
 *         - description
 *         - type
*/
export class ResourceModel extends BaseModel {
    topicId: number = 0;
    url: string = "";
    description: string ="";
    type: "video" | "article" | "pdf" = "article";
}

export const ResourceSchema = z.object({
    topicId: z.number(),
    url: z.string().url("Invalid URL format"),
    description: z.string(),
    type: z.enum(["video", "article", "pdf"])
});

