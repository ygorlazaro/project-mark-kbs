import { IResource, ResourceInput } from "./resource";
import { ResourceRepository } from "./resourceRepository";
import { v4 as uuidv4 } from "uuid";

export class ResourceService {
    constructor(private repository: ResourceRepository) {}

    createResource(data: ResourceInput): IResource {
        const resource: IResource = {
            id: uuidv4(),
            topicId: data.topicId,
            url: data.url,
            description: data.description,
            type: data.type,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        return this.repository.create(resource);
    }

    getResource(id: string): IResource | undefined {
        return this.repository.findById(id);
    }

    updateResource(id: string, data: Partial<ResourceInput>): IResource | undefined {
        return this.repository.update(id, data);
    }

    deleteResource(id: string): boolean {
        return this.repository.delete(id);
    }

    getAllResources(): IResource[] {
        return this.repository.findAll();
    }

    getResourcesByTopicId(topicId: string): IResource[] {
        return this.repository.findByTopicId(topicId);
    }
}
