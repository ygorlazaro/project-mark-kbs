import { Request, Response } from "express";
import { TopicService } from "../services/TopicService";
import { TopicInput, TopicSchema } from "../models/Topic";

export class TopicController {
    constructor(private service: TopicService) {}

    public findShortestPath = (req: Request, res: Response) => {
        const from = req.query.from as string;
        const to = req.query.to as string;

        if (!from || !to) {
            res.status(400).json({ message: "Missing 'from' or 'to' query parameter" });
            return;
        }

        const path = this.service.findShortestPath(from, to);

        if (!path) {
            res.status(404).json({ message: "No path found between the given topics" });
            return;
        }

        res.status(200).json(path);
    };

    public delete = (req: Request, res: Response) => {
        const deleted = this.service.deleteTopic(req.params.id);

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

        const topicInput: TopicInput = parseResult.data;
        const topic = this.service.createTopic(topicInput);

        res.status(201).json(topic);
    };

    public get = (req: Request, res: Response) => {
        const topicTree = this.service.getTopicTree(req.params.id);
        
        if (!topicTree) {
            res.status(404).json({ message: "Topic not found" });
            return;
        }

        res.json(topicTree);
    };

    public list = (req: Request, res: Response) => {
        const topics = this.service.getAllTopics();
        res.json(topics);
    };

    public put = (req: Request, res: Response) => {
        const parseResult = TopicSchema.safeParse(req.body);

        if (!parseResult.success) {
            res.status(400).json({ errors: parseResult.error.format() });
            return;
        }

        const topicInput: TopicInput = parseResult.data;
        const updatedTopic = this.service.updateTopic(req.params.id, topicInput);

        if (!updatedTopic) {
            res.status(404).json({ message: "Topic not found" });
            return;
        }

        res.json(updatedTopic);
    };
}
