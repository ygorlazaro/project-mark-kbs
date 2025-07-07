import { TopicModel } from "./topicModel";
import { TopicDataStore } from "./topicDataStore";
import { BaseRepository } from "../../abstracts/baseRepository";

export class TopicRepository extends BaseRepository<TopicModel> {

    constructor(data: TopicDataStore) {
        super(data);
    }

    findByParentId(parentTopicId: string): TopicModel[] {
        const topics = this.data.read();

        return topics.filter(t => t.parentTopicId === parentTopicId);
    }

    create(topic: TopicModel): TopicModel {
        if (topic.version !== 1) {
            topic.version = 1;
        }

        return super.create(topic);
    }

    update(id: string, data: Partial<TopicModel>): TopicModel | undefined {
        const existing = super.findById(id);

        if (!existing) {
            return undefined;
        }

        data.version = (existing.version || 0) + 1;
        data.parentTopicId = data.parentTopicId ?? existing.parentTopicId;

        return super.update(id, data);
    }

    findByParentIdAndVersion(parentTopicId: string, version: number): TopicModel | undefined {
        const topics = this.data.read();

        return topics.find(t => t.parentTopicId === parentTopicId && t.version === version);
    }
}
