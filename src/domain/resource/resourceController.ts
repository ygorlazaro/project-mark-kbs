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
        const resource = this.service.findById(req.params.id);

        if (!resource) {
            res.status(404).json({ message: "Resource not found" });

            return;
        }

        res.json(resource);
    };

    public findAll = (req: Request, res: Response) => {
        const resources = this.service.findAll();

        res.json(resources);
    };

    public update = (req: Request, res: Response) => {
        const parseResult = ResourceSchema.safeParse(req.body);

        if (!parseResult.success) {
            res.status(400).json({ errors: parseResult.error.format() });

            return;
        }

        const resourceInput = parseResult.data as ResourceModel;
        const updatedResource = this.service.update(req.params.id, resourceInput);

        if (!updatedResource) {
            res.status(404).json({ message: "Resource not found" });

            return;
        }

        res.json(updatedResource);
    };

    public delete = (req: Request, res: Response) => {
        const deleted = this.service.delete(req.params.id);

        if (!deleted) {
            res.status(404).json({ message: "Resource not found" });

            return;
        }

        res.status(200).json({ message: "Resource deleted successfully" });
    };

    public listByTopic = (req: Request, res: Response) => {
        const resources = this.service.getResourcesByTopicId(req.params.topicId);

        res.json(resources);
    };
}
