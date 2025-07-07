import { ResourceService } from "./resourceService";
import { ResourceRepository } from "./resourceRepository";
import { ResourceModel } from "./resourceModel";
import { ResourceDataStore } from "./resourceDataStore";

jest.mock("../../src/repositories/ResourceRepository");

describe("ResourceService", () => {
  let resourceService: ResourceService;
  let data: jest.Mocked<ResourceDataStore>;
  let mockRepository: jest.Mocked<ResourceRepository>;

  beforeEach(() => {
    data = new ResourceDataStore() as jest.Mocked<ResourceDataStore>;
    mockRepository = new ResourceRepository(data) as jest.Mocked<ResourceRepository>;
    resourceService = new ResourceService(mockRepository);
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a resource and call repository.create", () => {
      const input: ResourceModel = new ResourceModel();

      input.topicId = "t1";
      input.url = "https://example.com";
      input.description = "desc";
      input.type = "video";

      const createdResource: ResourceModel = {
        ...input,
        createdAt: input.createdAt,
        updatedAt: input.updatedAt,
      };

      mockRepository.create.mockReturnValue(createdResource);
      const result = resourceService.create(input);

      expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        topicId: input.topicId,
        url: input.url,
        description: input.description,
        type: input.type,
      }));
      expect(result).toEqual(createdResource);
    });
  });

  describe("findById", () => {
    it("should return resource by id using repository.findById", () => {
      const resource: ResourceModel = {
        id: "1",
        topicId: "t1",
        url: "https://example.com",
        description: "desc",
        type: "pdf",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findById.mockReturnValue(resource);
      const result = resourceService.findById("1");

      expect(mockRepository.findById).toHaveBeenCalledWith("1");
      expect(result).toEqual(resource);
    });
  });

  describe("update", () => {
    it("should update a resource", () => {
      const id = "1";
      const data = { description: "Updated" };
      const updatedResource: ResourceModel = {
        id: "1",
        topicId: "t1",
        url: "https://example.com",
        description: "Updated",
        type: "article",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.update.mockReturnValue(updatedResource);
      const result = resourceService.update(id, data);

      expect(mockRepository.update).toHaveBeenCalledWith(id, data);
      expect(result).toEqual(updatedResource);
    });
  });

  describe("delete", () => {
    it("should delete resource by id using repository.delete", () => {
      mockRepository.delete.mockReturnValue(true);
      const result = resourceService.delete("1");

      expect(mockRepository.delete).toHaveBeenCalledWith("1");
      expect(result).toBe(true);
    });
  });

  describe("findAll", () => {
    it("should return all resources using repository.findAll", () => {
      const resources: ResourceModel[] = [
        {
          id: "1",
          topicId: "t1",
          url: "https://example.com",
          description: "desc",
          type: "video",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          topicId: "t2",
          url: "https://example2.com",
          description: "desc2",
          type: "article",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findAll.mockReturnValue(resources);
      const result = resourceService.findAll();

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(resources);
    });
  });

  describe("findByIdsByTopicId", () => {
    it("should return resources for a topic", () => {
      const resources: ResourceModel[] = [
        {
          id: "1",
          topicId: "t1",
          url: "https://example.com",
          description: "desc",
          type: "video",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findByTopicId.mockReturnValue(resources);
      const result = resourceService.getResourcesByTopicId("t1");

      expect(mockRepository.findByTopicId).toHaveBeenCalledWith("t1");
      expect(result).toEqual(resources);
    });
  });
});
