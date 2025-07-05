import { Request, Response } from "express";
import { TopicService } from "../services/TopicService";

export class TopicController {
    constructor(private service: TopicService) { 
        this.create = this.create.bind(this);
        this.get = this.get.bind(this);
    }

    public create (req: Request, res: Response) {
        const topic = this.service.createTopic(req.body);
        
        res.status(201).json(topic);
    };

    public get(req: Request, res: Response) {
        const topic = this.service.getTopic(req.params.id);
        
        if (!topic) {
            res.status(404).json({ message: "Topic not found" });

            return;
        }

        res.json(topic);
    };
}
