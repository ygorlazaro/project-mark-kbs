import { Request, Response } from "express";
import { TopicService } from "../services/TopicService";

export class TopicController {
    constructor(private service: TopicService) { }

    public create  (req: Request, res: Response) {
        const topic = this.service.createTopic(req.body);
        
        res.status(201).json(topic);
    };

    public get (req: Request, res: Response) {
        const topic = this.service.getTopic(req.params.id);
        
        if (!topic) {
            return res.status(404).json({ message: "Topic not found" });
        }
        
        res.status(200).json(topic);
    };
}
