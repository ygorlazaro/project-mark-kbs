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

        if (!topic) {
            return undefined;
        }

        const buildTree = (node: ITopic): any => {
            const children = this.repository.findByParentId(node.id).map(buildTree);
            return { ...node, subtopics: children };
        };
        return buildTree(topic);
    }

    findShortestPath(fromId: string, toId: string): ITopic[] | null {
        if (fromId === toId) {
            const topic = this.repository.findById(fromId);
            return topic ? [topic] : null;
        }

        const allTopics = this.repository.findAll();
        const topicMap = new Map<string, ITopic>();

        for (const t of allTopics) {
            topicMap.set(t.id, t);
        }

        if (!topicMap.has(fromId) || !topicMap.has(toId)) {
            return null;
        }

        // Build adjacency list (bidirectional: parent <-> child)
        const adj = new Map<string, Set<string>>();

        for (const t of allTopics) {
            if (!adj.has(t.id)) {
                adj.set(t.id, new Set());
            }

            if (t.parentTopicId) {
                adj.get(t.id)!.add(t.parentTopicId);

                if (!adj.has(t.parentTopicId)) {
                    adj.set(t.parentTopicId, new Set());
                }

                adj.get(t.parentTopicId)!.add(t.id);
            }
        }

        // BFS
        const queue: string[][] = [[fromId]];
        const visited = new Set<string>([fromId]);

        while (queue.length > 0) {
            const path = queue.shift()!;
            const last = path[path.length - 1];

            if (last === toId) {
                return path.map(id => topicMap.get(id)!);
            }

            for (const neighbor of adj.get(last) || []) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push([...path, neighbor]);
                }
            }
        }
        return null;
    }
}
