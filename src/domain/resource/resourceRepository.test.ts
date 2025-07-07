import { ResourceRepository } from "./resourceRepository";
import { ResourceModel } from "./resourceModel";
import { ResourceDataStore } from "./resourceDataStore";
import { BaseModel } from "../../abstracts/baseModel";

describe("ResourceRepository", () => {
    let data: jest.Mocked<ResourceDataStore>;
    let repo: ResourceRepository;
    let sampleResource: ResourceModel;

    beforeEach(() => {
        // Reset the static ID counter before each test to ensure isolation
        BaseModel.resetId();
        data = new ResourceDataStore() as jest.Mocked<ResourceDataStore>;
        repo = new ResourceRepository(data);
        sampleResource = {
            topicId: 1,
            url: "https://example.com",
            description: "Sample resource",
            type: "article",
            createdAt: new Date(),
            updatedAt: new Date(),
            id: 1,
        };
    });

    test("create() should add a resource and return it with a new ID", () => {
        const created = repo.create(sampleResource);

        expect(created.id).toBe(1);
        expect(created.topicId).toBe(1);
        expect(repo.findAll()).toContainEqual(created);
    });

    test("findById() should return the resource with the given id", () => {
        const created = repo.create(sampleResource);
        const found = repo.findById(1);

        expect(found).toEqual(created);
    });

    test("findById() should return undefined if resource not found", () => {
        const found = repo.findById(999);

        expect(found).toBeUndefined();
    });

    test("findAll() should return all resources", () => {
        repo.create(sampleResource);
        const all = repo.findAll();

        expect(all).toHaveLength(1);
        expect(all[0].topicId).toBe(1);
    });

    test("update() should update an existing resource", () => {
        repo.create(sampleResource);
        const updated = repo.update(1, { description: "Updated desc" });

        expect(updated).toBeDefined();
        expect(updated?.description).toBe("Updated desc");
        expect(updated?.id).toBe(1);
    });

    test("update() should return undefined if resource not found", () => {
        const updated = repo.update(999, { description: "Updated desc" });

        expect(updated).toBeUndefined();
    });

    test("delete() should remove the resource and return true", () => {
        repo.create(sampleResource);
        const deleted = repo.delete(1);

        expect(deleted).toBe(true);
        expect(repo.findById(1)).toBeUndefined();
    });

    test("delete() should return false if resource not found", () => {
        const deleted = repo.delete(999);

        expect(deleted).toBe(false);
    });

    test("findByTopicId() should return resources for a topic", () => {
        repo.create(sampleResource); // topicId: 1
        repo.create({ ...sampleResource, topicId: 2 });

        const found = repo.findByTopicId(1);

        expect(found).toHaveLength(1);
        expect(found[0].topicId).toBe(1);
    });
});
