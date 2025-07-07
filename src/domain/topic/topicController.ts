import { Request, Response } from "express";
import { TopicModel, TopicSchema } from "./topicModel";
import { TopicService } from "./topicService";

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
        const deleted = this.service.delete(req.params.id);

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
        const topicTree = this.service.getTopicTree(req.params.id);
        
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
        const parseResult = TopicSchema.safeParse(req.body);

        if (!parseResult.success) {
            res.status(400).json({ errors: parseResult.error.format() });

            return;
        }

        const topicInput = parseResult.data as TopicModel;
        const updatedTopic = this.service.update(req.params.id, topicInput);

        if (!updatedTopic) {
            res.status(404).json({ message: "Topic not found" });

            return;
        }

        res.json(updatedTopic);
    };
}
