import { TopicModel } from "./topicModel";
import { TopicDataStore } from "./topicDataStore";
import { TopicRepository } from "./topicRepository";

describe("TopicRepository", () => {
    let data: jest.Mocked<TopicDataStore>;
    let repo: TopicRepository;
    let sampleTopic: TopicModel;

    beforeEach(() => {
        data = {
            read: jest.fn().mockReturnValue([]),
            write: jest.fn(),
        } as unknown as jest.Mocked<TopicDataStore>;

        repo = new TopicRepository(data);

        // Reset the static ID counter for consistent test runs
        (TopicModel as any).nextId = 1;

        sampleTopic = repo.create({
          name: "Sample Topic",
          content: "This is a sample topic",
        } as TopicModel);
    });

    test("create() should add a topic and return it with a numeric ID", () => {
        expect(sampleTopic.id).toBe(1);
        expect(typeof sampleTopic.id).toBe("number");
        expect(repo.findAll()).toContainEqual(sampleTopic);
    });

    test("findById() should return the topic with the given id", () => {
        const found = repo.findById(1);

        expect(found).toEqual(sampleTopic);
    });

    test("findById() should return undefined if topic not found", () => {
        const found = repo.findById(999);

        expect(found).toBeUndefined();
    });

    test("findAll() should return all topics", () => {
        const all = repo.findAll();

        expect(all).toHaveLength(1);
        expect(all).toContainEqual(sampleTopic);
    });

    test("update() should update an existing topic and increment version", () => {
        const updated = repo.update(1, { name: "Updated Title" });

        expect(updated).toBeDefined();
        expect(updated?.name).toBe("Updated Title");
        expect(updated?.version).toBe(sampleTopic.version + 1);
        expect(updated?.id).toBe(sampleTopic.id);
        expect(updated?.createdAt).toEqual(sampleTopic.createdAt);
        expect(updated?.updatedAt).not.toEqual(sampleTopic.updatedAt);
    });

    test("update() should return undefined if topic not found", () => {
        const updated = repo.update(999, { name: "Updated Title" });

        expect(updated).toBeUndefined();
    });

    test("delete() should remove the topic and return true", () => {
        const deleted = repo.delete(1);

        expect(deleted).toBe(true);
        expect(repo.findById(1)).toBeUndefined();
    });

    test("delete() should return false if topic not found", () => {
        const deleted = repo.delete(999);

        expect(deleted).toBe(false);
    });
});
