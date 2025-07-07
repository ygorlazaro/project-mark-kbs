import { BaseRepository } from "../../abstracts/baseRepository";
import { ResourceModel } from "./resourceModel";
import { ResourceDataStore } from "./resourceDataStore";

export class ResourceRepository extends BaseRepository<ResourceModel> {
    constructor(data: ResourceDataStore) {
        super(data);
    }


    findByTopicId(topicId: number): ResourceModel[] {
        const resources = this.data.read();

        return resources.filter(r => r.topicId === topicId);
    }
}
