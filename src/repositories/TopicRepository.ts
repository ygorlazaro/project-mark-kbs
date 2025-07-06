import { ITopic } from "../models/Topic";
import { v4 as uuidv4 } from "uuid";

export class TopicRepository {
    private topics: ITopic[] = [];

    findByParentId(parentTopicId: string): ITopic[] {
        return this.topics.filter(t => t.parentTopicId === parentTopicId);
    }

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
        const existing = this.topics.find(t => t.id === id);
        if (!existing) {
            return undefined;
        }
        // Create a new version of the topic instead of updating in place
        const newVersion = (existing.version || 0) + 1;
        const newTopic: ITopic = {
            id: uuidv4(),
            name: data.name ?? existing.name,
            content: data.content ?? existing.content,
            createdAt: existing.createdAt,
            updatedAt: new Date(),
            version: newVersion,
            parentTopicId: data.parentTopicId ?? existing.parentTopicId,
        };
        this.topics.push(newTopic);
        return newTopic;
    }

    delete(id: string): boolean {
        const index = this.topics.findIndex(t => t.id === id);
        if (index === -1) {
            return false;
        }
        this.topics.splice(index, 1);
        return true;
    }

    findByParentIdAndVersion(parentTopicId: string, version: number): ITopic | undefined {
        return this.topics.find(t => t.parentTopicId === parentTopicId && t.version === version);
    }
}
