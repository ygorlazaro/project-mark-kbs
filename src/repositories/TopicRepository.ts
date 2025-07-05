import { ITopic } from "../models/Topic";

export class TopicRepository {
    private topics: ITopic[] = [];

    create(topic: ITopic): ITopic {
        this.topics.push(topic);
        return topic;
    }

    findById(id: string): ITopic | undefined {
        return this.topics.find(t => t.id === id);
    }

    findAll(): ITopic[] {
        return this.topics;
    }

    update(id: string, data: Partial<Omit<ITopic, "id" | "createdAt" | "updatedAt">>): ITopic | undefined {
        const index = this.topics.findIndex(t => t.id === id);
        if (index === -1) {
            return undefined;
        }
        const existing = this.topics[index];
        const updated: ITopic = {
            ...existing,
            ...data,
            updatedAt: new Date(),
            version: (existing.version || 0) + 1,
        };
        this.topics[index] = updated;
        return updated;
    }

    delete(id: string): boolean {
        const index = this.topics.findIndex(t => t.id === id);
        if (index === -1) {
            return false;
        }
        this.topics.splice(index, 1);
        return true;
    }
}
