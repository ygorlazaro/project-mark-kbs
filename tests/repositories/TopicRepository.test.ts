import { TopicRepository } from "../../src/repositories/TopicRepository";
import { ITopic } from "../../src/models/Topic";

describe("TopicRepository", () => {
  let repo: TopicRepository;
    let sampleTopic: ITopic;

    beforeEach(() => {
        repo = new TopicRepository();
        sampleTopic = {
          id: "1",
          name: "Sample Topic",
          content: "This is a sample topic",
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
        };
    });

    test("create() should add a topic and return it", () => {
        const created = repo.create(sampleTopic);
        expect(created).toEqual(sampleTopic);
        expect(repo.findAll()).toContainEqual(sampleTopic);
    });

    test("findById() should return the topic with the given id", () => {
        repo.create(sampleTopic);
        const found = repo.findById("1");
        expect(found).toEqual(sampleTopic);
    });

    test("findById() should return undefined if topic not found", () => {
        const found = repo.findById("nonexistent");
        expect(found).toBeUndefined();
    });

    test("findAll() should return all topics", () => {
        repo.create(sampleTopic);
        const all = repo.findAll();
        expect(all).toHaveLength(1);
        expect(all).toContainEqual(sampleTopic);
    });

    test("update() should update an existing topic and increment version", () => {
        repo.create(sampleTopic);
        const updated = repo.update("1", { name: "Updated Title" });
        expect(updated).toBeDefined();
        expect(updated?.name).toBe("Updated Title");
        expect(updated?.version).toBe(sampleTopic.version + 1);
        expect(updated?.id).toBe(sampleTopic.id);
        expect(updated?.createdAt).toBe(sampleTopic.createdAt);
        expect(updated?.updatedAt).not.toBe(sampleTopic.updatedAt);
    });

    test("update() should return undefined if topic not found", () => {
        const updated = repo.update("nonexistent", { name: "Updated Title" });
        expect(updated).toBeUndefined();
    });

    test("delete() should remove the topic and return true", () => {
        repo.create(sampleTopic);
        const deleted = repo.delete("1");
        expect(deleted).toBe(true);
        expect(repo.findById("1")).toBeUndefined();
    });

    test("delete() should return false if topic not found", () => {
        const deleted = repo.delete("nonexistent");
        expect(deleted).toBe(false);
    });
});
