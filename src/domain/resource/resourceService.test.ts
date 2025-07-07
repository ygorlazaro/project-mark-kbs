import { ResourceService } from "./resourceService";
import { ResourceRepository } from "./resourceRepository";
import { ResourceModel } from "./resourceModel";

jest.mock("./resourceRepository");

describe("ResourceService", () => {
    let resourceService: ResourceService;
    let mockRepository: jest.Mocked<ResourceRepository>;

    beforeEach(() => {
        // Casting to jest.Mocked<ResourceRepository> is not strictly necessary
        // because of the jest.mock call, but it provides type safety.
        mockRepository = new (ResourceRepository as any)() as jest.Mocked<ResourceRepository>; 
        resourceService = new ResourceService(mockRepository);
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create a resource and call repository.create", () => {
            const input: ResourceModel = {
                topicId: 1,
                url: "https://example.com",
                description: "desc",
                type: "video",
                createdAt: new Date(),
                updatedAt: new Date(),
                id: 1,
            };

            const createdResource: ResourceModel = {
                ...input,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockRepository.create.mockReturnValue(createdResource);
            const result = resourceService.create(input);

            expect(mockRepository.create).toHaveBeenCalledWith(input);
            expect(result).toEqual(createdResource);
        });
    });

    describe("findById", () => {
        it("should return resource by id using repository.findById", () => {
            const resource: ResourceModel = {
                id: 1,
                topicId: 1,
                url: "https://example.com",
                description: "desc",
                type: "pdf",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockRepository.findById.mockReturnValue(resource);
            const result = resourceService.findById(1);

            expect(mockRepository.findById).toHaveBeenCalledWith(1);
            expect(result).toEqual(resource);
        });
    });

    describe("update", () => {
        it("should update a resource", () => {
            const id = 1;
            const data = { description: "Updated" };
            const updatedResource: ResourceModel = {
                id: 1,
                topicId: 1,
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
            const result = resourceService.delete(1);

            expect(mockRepository.delete).toHaveBeenCalledWith(1);
            expect(result).toBe(true);
        });
    });

    describe("findAll", () => {
        it("should return all resources using repository.findAll", () => {
            const resources: ResourceModel[] = [
                {
                    id: 1,
                    topicId: 1,
                    url: "https://example.com",
                    description: "desc",
                    type: "video",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    topicId: 2,
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

    describe("getResourcesByTopicId", () => {
        it("should return resources for a topic", () => {
            const resources: ResourceModel[] = [
                {
                    id: 1,
                    topicId: 1,
                    url: "https://example.com",
                    description: "desc",
                    type: "video",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            mockRepository.findByTopicId.mockReturnValue(resources);
            const result = resourceService.getResourcesByTopicId(1);

            expect(mockRepository.findByTopicId).toHaveBeenCalledWith(1);
            expect(result).toEqual(resources);
        });
    });
});
