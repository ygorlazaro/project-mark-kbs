import { BaseService } from "../../abstracts/baseService";
import { TopicModel } from "./topicModel";
import { TopicRepository } from "./topicRepository";

export class TopicService extends BaseService<TopicModel, TopicRepository> {
    constructor(repository: TopicRepository) {
        super(repository);
    }

        update(id: number, data: Partial<TopicModel>): TopicModel | undefined {
        if (data.parentTopicId) {
            const parentExists = this.repository.findById(data.parentTopicId);

            if (!parentExists) {
                return undefined;
            }
        }

        return this.repository.update(id, data);
    }

        getTopicVersion(parentTopicId: number, version: number): TopicModel | undefined {
        return this.repository.findByParentIdAndVersion(parentTopicId, version);
    }

        getTopicTree(id: number): TopicModel & { subtopics: TopicModel[] } | undefined {
        const topic = this.repository.findById(id);

        if (!topic) {
            return undefined;
        }

        const buildTree = (node: TopicModel): any => {
            const children = this.repository.findByParentId(node.id).map(buildTree);

            return { ...node, subtopics: children };
        };

        return buildTree(topic);
    }

        findShortestPath(fromId: number, toId: number): TopicModel[] | null {
        if (fromId === toId) {
            const topic = this.repository.findById(fromId);

            return topic ? [topic] : null;
        }

        const allTopics = this.repository.findAll();
                const topicMap = new Map<number, TopicModel>();

        for (const t of allTopics) {
            topicMap.set(t.id, t);
        }

        if (!topicMap.has(fromId) || !topicMap.has(toId)) {
            return null;
        }

        // Build adjacency list (bidirectional: parent <-> child)
                const adj = new Map<number, Set<number>>();

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
                const queue: number[][] = [[fromId]];
        const visited = new Set<number>([fromId]);

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
