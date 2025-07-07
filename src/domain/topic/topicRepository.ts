import { TopicModel } from "./topicModel";
import { TopicDataStore } from "./topicDataStore";
import { BaseRepository } from "../../abstracts/baseRepository";

export class TopicRepository extends BaseRepository<TopicModel> {

    constructor(data: TopicDataStore) {
        super(data);
    }

    findByParentId(parentTopicId: number): TopicModel[] {
        const topics = this.data.read();

        return topics.filter(t => t.parentTopicId === parentTopicId);
    }

    create(topic: TopicModel): TopicModel {
        const topicToCreate = { ...topic, version: 1 };

        return super.create(topicToCreate);
    }

    update(id: number, data: Partial<TopicModel>): TopicModel | undefined {
        const existing = super.findById(id);

        if (!existing) {
            return undefined;
        }

        data.version = (existing.version || 0) + 1;
        data.parentTopicId = data.parentTopicId ?? existing.parentTopicId;

            return super.update(id, data);
    }

    findByParentIdAndVersion(parentTopicId: number, version: number): TopicModel | undefined {
        const topics = this.data.read();

        return topics.find(t => t.parentTopicId === parentTopicId && t.version === version);
    }
}
