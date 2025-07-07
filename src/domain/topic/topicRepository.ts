import { v4 as uuidv4 } from "uuid";
import { ITopic } from "./topic";
import { TopicDataStore } from "./topicDataStore";

export class TopicRepository {

    constructor(private data: TopicDataStore) {
        
    }

    findByParentId(parentTopicId: string): ITopic[] {
        const topics = this.data.read();

        return topics.filter(t => t.parentTopicId === parentTopicId);
    }

    create(data: { name: string; content: string; parentTopicId?: string }): ITopic {
        const topics = this.data.read();
        const newTopic: ITopic = {
            id: uuidv4(),
            name: data.name,
            content: data.content,
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
            parentTopicId: data.parentTopicId,
        };

        topics.push(newTopic);
        this.data.write(topics);

        return newTopic;
    }

    findById(id: string): ITopic | undefined {
        const topics = this.data.read();

        return topics.find(t => t.id === id);
    }

    findAll(): ITopic[] {
        return this.data.read();
    }

    update(id: string, data: Partial<Omit<ITopic, "id" | "createdAt" | "updatedAt">>): ITopic | undefined {
        const topics = this.data.read();
        const existing = topics.find(t => t.id === id);

        if (!existing) {
            return undefined;
        }

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

        topics.push(newTopic);
        this.data.write(topics);

        return newTopic;
    }

    delete(id: string): boolean {
        const topics = this.data.read();
        const index = topics.findIndex(t => t.id === id);

        if (index === -1) {
            return false;
        }

        topics.splice(index, 1);
        this.data.write(topics);

        return true;
    }

    findByParentIdAndVersion(parentTopicId: string, version: number): ITopic | undefined {
        const topics = this.data.read();

        return topics.find(t => t.parentTopicId === parentTopicId && t.version === version);
    }
}
