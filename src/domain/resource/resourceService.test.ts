import { ResourceService } from "./resourceService";
import { ResourceRepository } from "./resourceRepository";
import { IResource, ResourceInput } from "./resource";
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

  describe("createResource", () => {
    it("should create a resource and call repository.create", () => {
      const input: ResourceInput = {
        topicId: "t1",
        url: "https://example.com",
        description: "desc",
        type: "video",
      };
      const createdResource: IResource = {
        id: "uuid",
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(createdResource);
      const result = resourceService.createResource(input);

      expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        topicId: input.topicId,
        url: input.url,
        description: input.description,
        type: input.type,
      }));
      expect(result).toEqual(createdResource);
    });
  });

  describe("getResource", () => {
    it("should return resource by id using repository.findById", () => {
      const resource: IResource = {
        id: "1",
        topicId: "t1",
        url: "https://example.com",
        description: "desc",
        type: "pdf",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findById.mockReturnValue(resource);
      const result = resourceService.getResource("1");

      expect(mockRepository.findById).toHaveBeenCalledWith("1");
      expect(result).toEqual(resource);
    });
  });

  describe("updateResource", () => {
    it("should update a resource", () => {
      const id = "1";
      const data = { description: "Updated" };
      const updatedResource: IResource = {
        id: "1",
        topicId: "t1",
        url: "https://example.com",
        description: "Updated",
        type: "article",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.update.mockReturnValue(updatedResource);
      const result = resourceService.updateResource(id, data);

      expect(mockRepository.update).toHaveBeenCalledWith(id, data);
      expect(result).toEqual(updatedResource);
    });
  });

  describe("deleteResource", () => {
    it("should delete resource by id using repository.delete", () => {
      mockRepository.delete.mockReturnValue(true);
      const result = resourceService.deleteResource("1");

      expect(mockRepository.delete).toHaveBeenCalledWith("1");
      expect(result).toBe(true);
    });
  });

  describe("getAllResources", () => {
    it("should return all resources using repository.findAll", () => {
      const resources: IResource[] = [
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
      const result = resourceService.getAllResources();

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(resources);
    });
  });

  describe("getResourcesByTopicId", () => {
    it("should return resources for a topic", () => {
      const resources: IResource[] = [
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
