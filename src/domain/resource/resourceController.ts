import { Request, Response } from "express";
import { ResourceService } from "./resourceService";
import { ResourceModel, ResourceSchema } from "./resourceModel";

export class ResourceController {
    constructor(private service: ResourceService) {}

    public create = (req: Request, res: Response) => {
        const parseResult = ResourceSchema.safeParse(req.body);

        if (!parseResult.success) {
            res.status(400).json({ errors: parseResult.error.format() });

            return;
        }

        const resourceInput = parseResult.data as ResourceModel;
        const resource = this.service.create(resourceInput);

        res.status(201).json(resource);
    };

    public findById = (req: Request, res: Response) => {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid ID format" });

            return;
        }

        const resource = this.service.findById(id);

        if (!resource) {
            res.status(404).json({ message: "Resource not found" });

            return;
        }

        res.status(200).json(resource);
    };

    public findAll = (req: Request, res: Response) => {
        const resources = this.service.findAll();

        res.status(200).json(resources);
    };

    public update = (req: Request, res: Response) => {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid ID format" });

            return;
        }

        const parseResult = ResourceSchema.safeParse(req.body);

        if (!parseResult.success) {
            res.status(400).json({ errors: parseResult.error.format() });

            return;
        }

        const resourceInput = parseResult.data as ResourceModel;
        const updatedResource = this.service.update(id, resourceInput);

        if (!updatedResource) {
            res.status(404).json({ message: "Resource not found" });

            return;
        }

        res.status(200).json(updatedResource);
    };

    public delete = (req: Request, res: Response) => {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid ID format" });

            return;
        }

        const deleted = this.service.delete(id);

        if (!deleted) {
            res.status(404).json({ message: "Resource not found" });

            return;
        }

        res.status(200).json({ message: "Resource deleted successfully" });
    };

    public listByTopic = (req: Request, res: Response) => {
        const topicId = parseInt(req.params.topicId, 10);

        if (isNaN(topicId)) {
            res.status(400).json({ message: "Invalid topic ID format" });

            return;
        }

        const resources = this.service.getResourcesByTopicId(topicId);

        res.status(200).json(resources);
    };
}
