import { Request, Response } from "express";
import { ResourceService } from "./resourceService";
import { ResourceInput, ResourceSchema } from "./resource";

export class ResourceController {
    constructor(private service: ResourceService) {}

    public create = (req: Request, res: Response) => {
        const parseResult = ResourceSchema.safeParse(req.body);

        if (!parseResult.success) {
            res.status(400).json({ errors: parseResult.error.format() });

            return;
        }

        const resourceInput: ResourceInput = parseResult.data;
        const resource = this.service.createResource(resourceInput);

        res.status(201).json(resource);
    };

    public get = (req: Request, res: Response) => {
        const resource = this.service.getResource(req.params.id);

        if (!resource) {
            res.status(404).json({ message: "Resource not found" });

            return;
        }

        res.json(resource);
    };

    public list = (req: Request, res: Response) => {
        const resources = this.service.getAllResources();

        res.json(resources);
    };

    public put = (req: Request, res: Response) => {
        const parseResult = ResourceSchema.safeParse(req.body);

        if (!parseResult.success) {
            res.status(400).json({ errors: parseResult.error.format() });

            return;
        }

        const resourceInput: ResourceInput = parseResult.data;
        const updatedResource = this.service.updateResource(req.params.id, resourceInput);

        if (!updatedResource) {
            res.status(404).json({ message: "Resource not found" });

            return;
        }

        res.json(updatedResource);
    };

    public delete = (req: Request, res: Response) => {
        const deleted = this.service.deleteResource(req.params.id);

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
