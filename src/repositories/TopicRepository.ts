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
}
