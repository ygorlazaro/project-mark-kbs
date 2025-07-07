import { IResource } from "./resource";
import { ResourceDataStore } from "./resourceDataStore";

export class ResourceRepository {
    constructor(private data: ResourceDataStore) {
    
    }

    create(resource: IResource): IResource {
        const resources = this.data.read();

        resources.push(resource);
        this.data.write(resources);

        return resource;
    }

    findById(id: string): IResource | undefined {
        const resources = this.data.read();

        return resources.find(r => r.id === id);
    }

    findAll(): IResource[] {
        return this.data.read();
    }

    update(id: string, data: Partial<Omit<IResource, "id" | "createdAt" | "updatedAt">>): IResource | undefined {
        const resources = this.data.read();
        const index = resources.findIndex(r => r.id === id);

        if (index === -1) {
            return undefined;
        }

        const existing = resources[index];
        const updatedResource: IResource = {
            ...existing,
            ...data,
            updatedAt: new Date(),
        };

        resources[index] = updatedResource;
        this.data.write(resources);

        return updatedResource;
    }

    delete(id: string): boolean {
        const resources = this.data.read();
        const index = resources.findIndex(r => r.id === id);

        if (index === -1) {
            return false;
        }

        resources.splice(index, 1);
        this.data.write(resources);

        return true;
    }

    findByTopicId(topicId: string): IResource[] {
        const resources = this.data.read();

        return resources.filter(r => r.topicId === topicId);
    }
}
