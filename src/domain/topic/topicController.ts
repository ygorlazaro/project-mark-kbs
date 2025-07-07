import { Request, Response } from "express";
import { TopicModel, TopicSchema } from "./topicModel";
import { TopicService } from "./topicService";

export class TopicController {
    constructor(private service: TopicService) {}

        public findShortestPath = (req: Request, res: Response) => {
        const { startId, endId } = req.query;

        if (!startId || !endId) {
            res.status(400).json({ message: "Missing 'startId' or 'endId' query parameter" });

            return;
        }

        const fromId = parseInt(startId as string, 10);
        const toId = parseInt(endId as string, 10);

        if (isNaN(fromId) || isNaN(toId)) {
            res.status(400).json({ message: "Invalid ID format" });

            return;
        }

        const path = this.service.findShortestPath(fromId, toId);

        if (!path) {
            res.status(404).json({ message: "No path found between the given topics" });

            return;
        }

        res.status(200).json(path);
    };

        public delete = (req: Request, res: Response) => {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid ID format" });

            return;
        }

        const deleted = this.service.delete(id);

        if (!deleted) {
            res.status(404).json({ message: "Topic not found" });

            return;
        }

        res.status(200).json({ message: "Topic deleted successfully" });
    };

    public create = (req: Request, res: Response) => {
        const parseResult = TopicSchema.safeParse(req.body);

        if (!parseResult.success) {
            res.status(400).json({ errors: parseResult.error.format() });

            return;
        }

        const topicInput = parseResult.data as TopicModel;
        const topic = this.service.create(topicInput);

        res.status(201).json(topic);
    };

        public findById = (req: Request, res: Response) => {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid ID format" });

            return;
        }

        const topicTree = this.service.getTopicTree(id);
        
        if (!topicTree) {
            res.status(404).json({ message: "Topic not found" });

            return;
        }

        res.json(topicTree);
    };

    public findAll = (req: Request, res: Response) => {
        const topics = this.service.findAll();

        res.json(topics);
    };

        public update = (req: Request, res: Response) => {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid ID format" });

            return;
        }

        const parseResult = TopicSchema.partial().safeParse(req.body);

        if (!parseResult.success) {
            res.status(400).json({ errors: parseResult.error.format() });

            return;
        }

        const topicInput = parseResult.data as Partial<TopicModel>;
        const updatedTopic = this.service.update(id, topicInput);

        if (!updatedTopic) {
            res.status(404).json({ message: "Topic not found" });

            return;
        }

        res.json(updatedTopic);
    };
}
