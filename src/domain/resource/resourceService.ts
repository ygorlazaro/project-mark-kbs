import { BaseService } from "../../abstracts/baseService";
import { ResourceModel } from "./resourceModel";
import { ResourceRepository } from "./resourceRepository";

export class ResourceService extends BaseService<ResourceModel, ResourceRepository> {
    constructor(repository: ResourceRepository) {
        super(repository);
    }

    getResourcesByTopicId(topicId: number): ResourceModel[] {
        return this.repository.findByTopicId(topicId);
    }
}
