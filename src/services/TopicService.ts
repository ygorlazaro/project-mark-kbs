import { ITopic } from "../models/Topic";
import { TopicRepository } from "../repositories/TopicRepository";
import {v4 as uuidv4} from "uuid";

export class TopicService {
    constructor(private repository: TopicRepository) { }

    createTopic(data: Omit<ITopic, "id" | "createdAt" | "updatedAt" | "version">): ITopic {
        const topic: ITopic = {
            id: uuidv4(),
            name: data.name,
            content: data.content,
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
            parentTopicId: data.parentTopicId,
        };
        return this.repository.create(topic);
    }

    getTopic(id: string): ITopic | undefined {
        return this.repository.findById(id);
    }

    updateTopic(id: string, data: Partial<Omit<ITopic, "id" | "createdAt" | "updatedAt">>): ITopic | undefined {
        if (data.parentTopicId) {
            const parentExists = this.repository.findById(data.parentTopicId);
            if (!parentExists) {
                return undefined;
            }
        }
        return this.repository.update(id, data);
    }

    getTopicVersion(parentTopicId: string, version: number): ITopic | undefined {
        return this.repository.findByParentIdAndVersion(parentTopicId, version);
    }

    deleteTopic(id: string): boolean {
        return this.repository.delete(id);
    }

    getAllTopics(): ITopic[] {
        return this.repository.findAll();
    }

    getTopicTree(id: string): any | undefined {
        const topic = this.repository.findById(id);
        if (!topic) return undefined;
        const buildTree = (node: ITopic): any => {
            const children = this.repository.findByParentId(node.id).map(buildTree);
            return { ...node, subtopics: children };
        };
        return buildTree(topic);
    }
}
