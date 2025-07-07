import { ResourceRepository } from "./resourceRepository";
import { ResourceModel } from "./resourceModel";
import { ResourceDataStore } from "./resourceDataStore";

describe("ResourceRepository", () => {
  let data: jest.Mocked<ResourceDataStore>;
  let repo: ResourceRepository;
  let sampleResource: ResourceModel;

  beforeEach(() => {
    data = new ResourceDataStore() as jest.Mocked<ResourceDataStore>;
    repo = new ResourceRepository(data);
    sampleResource = {
      id: "1",
      topicId: "t1",
      url: "https://example.com",
      description: "Sample resource",
      type: "article",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  test("create() should add a resource and return it", () => {
    const created = repo.create(sampleResource);

    expect(created).toEqual(sampleResource);
    expect(repo.findAll()).toContainEqual(sampleResource);
  });

  test("findById() should return the resource with the given id", () => {
    repo.create(sampleResource);
    const found = repo.findById("1");

    expect(found).toEqual(sampleResource);
  });

  test("findById() should return undefined if resource not found", () => {
    const found = repo.findById("nonexistent");

    expect(found).toBeUndefined();
  });

  test("findAll() should return all resources", () => {
    repo.create(sampleResource);
    const all = repo.findAll();

    expect(all).toHaveLength(1);
    expect(all).toContainEqual(sampleResource);
  });

  test("update() should update an existing resource", () => {
    repo.create(sampleResource);
    const updated = repo.update("1", { description: "Updated desc" });

    expect(updated).toBeDefined();
    expect(updated?.description).toBe("Updated desc");
    expect(updated?.id).toBe(sampleResource.id);
    expect(updated?.createdAt).toBe(sampleResource.createdAt);
    expect(updated?.updatedAt).not.toBe(sampleResource.updatedAt);
  });

  test("update() should return undefined if resource not found", () => {
    const updated = repo.update("nonexistent", { description: "Updated desc" });

    expect(updated).toBeUndefined();
  });

  test("delete() should remove the resource and return true", () => {
    repo.create(sampleResource);
    const deleted = repo.delete("1");

    expect(deleted).toBe(true);
    expect(repo.findById("1")).toBeUndefined();
  });

  test("delete() should return false if resource not found", () => {
    const deleted = repo.delete("nonexistent");

    expect(deleted).toBe(false);
  });

  test("findByTopicId() should return resources for a topic", () => {
    repo.create(sampleResource);
    const another: ResourceModel = { ...sampleResource, id: "2", topicId: "t2" };

    repo.create(another);
    const found = repo.findByTopicId("t1");

    expect(found).toEqual([sampleResource]);
  });
});
