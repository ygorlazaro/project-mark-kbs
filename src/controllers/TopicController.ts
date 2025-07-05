import { Request, Response } from "express";
import { TopicService } from "../services/TopicService";
import { TopicInput, TopicSchema } from "../models/Topic";

export class TopicController {
    constructor(private service: TopicService) { 
        this.create = this.create.bind(this);
        this.get = this.get.bind(this);
    }

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
    public create (req: Request, res: Response) {
        const parseResult = TopicSchema.safeParse(req.body);

        if (!parseResult.success) {
            res.status(400).json({ errors: parseResult.error.format() });

            return;
        }

        const topicInput: TopicInput = parseResult.data;
        const topic = this.service.createTopic(topicInput);

        res.status(201).json(topic);
    };

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
    public get(req: Request, res: Response) {
        const topic = this.service.getTopic(req.params.id);
        
        if (!topic) {
            res.status(404).json({ message: "Topic not found" });

            return;
        }

        res.json(topic);
    };
}
