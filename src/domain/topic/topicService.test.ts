import { TopicModel } from "./topicModel";
import { TopicRepository } from "./topicRepository";
import { TopicService } from "./topicService";

// Mock the repository
jest.mock("./topicRepository");

describe("TopicService", () => {
    let topicService: TopicService;
    let mockRepository: jest.Mocked<TopicRepository>;

    beforeEach(() => {
        // Create a new mock instance for each test
        mockRepository = new (TopicRepository as any)(null) as jest.Mocked<TopicRepository>;
        topicService = new TopicService(mockRepository);
        (TopicModel as any).nextId = 1; // Reset ID counter
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create a topic by calling repository.create", () => {
            const input: Partial<TopicModel> = {
                name: "Test Topic",
                content: "Test Content",
            };
            const createdTopic: TopicModel = {
                id: 1,
                ...input,
                createdAt: new Date(),
                updatedAt: new Date(),
                version: 1,
            } as TopicModel;

            mockRepository.create.mockReturnValue(createdTopic);

            const result = topicService.create(input as TopicModel);

            expect(mockRepository.create).toHaveBeenCalledWith(input);
            expect(result).toEqual(createdTopic);
        });
    });

    describe("findById", () => {
        it("should return a topic by id using repository.findById", () => {
            const topic: TopicModel = {
                id: 1,
                name: "Topic 1",
                content: "Content 1",
                createdAt: new Date(),
                updatedAt: new Date(),
                version: 1,
            };

            mockRepository.findById.mockReturnValue(topic);

            const result = topicService.findById(1);

            expect(mockRepository.findById).toHaveBeenCalledWith(1);
            expect(result).toEqual(topic);
        });
    });

    describe("update", () => {
        it("should update a topic if parentTopicId is valid", () => {
            const id = 1;
            const data: Partial<TopicModel> = { name: "Updated Name", parentTopicId: 2 };
            const parentTopic: TopicModel = {
                id: 2,
                name: "Parent Topic",
                content: "Parent Content",
                createdAt: new Date(),
                updatedAt: new Date(),
                version: 1,
            };
            const updatedTopic: TopicModel = {
                id: 1,
                name: data.name!,
                content: "Old Content",
                createdAt: new Date(),
                updatedAt: new Date(),
                version: 2,
                parentTopicId: data.parentTopicId,
            };

            mockRepository.findById.mockReturnValue(parentTopic);
            mockRepository.update.mockReturnValue(updatedTopic);

            const result = topicService.update(id, data);

            expect(mockRepository.findById).toHaveBeenCalledWith(2);
            expect(mockRepository.update).toHaveBeenCalledWith(id, data);
            expect(result).toEqual(updatedTopic);
        });

        it("should return undefined if parentTopicId does not exist", () => {
            const id = 1;
            const data = { parentTopicId: 999 };

            mockRepository.findById.mockReturnValue(undefined);

            const result = topicService.update(id, data);

            expect(mockRepository.findById).toHaveBeenCalledWith(999);
            expect(mockRepository.update).not.toHaveBeenCalled();
            expect(result).toBeUndefined();
        });
    });

    describe("delete", () => {
        it("should delete a topic by id using repository.delete", () => {
            mockRepository.delete.mockReturnValue(true);
            const result = topicService.delete(1);

            expect(mockRepository.delete).toHaveBeenCalledWith(1);
            expect(result).toBe(true);
        });
    });

    describe("findAll", () => {
        it("should return all topics using repository.findAll", () => {
            const topics: TopicModel[] = [
                { id: 1, name: "Topic 1", content: "Content 1", createdAt: new Date(), updatedAt: new Date(), version: 1 },
                { id: 2, name: "Topic 2", content: "Content 2", createdAt: new Date(), updatedAt: new Date(), version: 1, parentTopicId: 1 },
            ];

            mockRepository.findAll.mockReturnValue(topics);

            const result = topicService.findAll();

            expect(mockRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual(topics);
        });
    });

    describe("findShortestPath", () => {
        it("should return the direct path if from and to are the same", () => {
            const topic: TopicModel = { id: 1, name: "A", content: "B", createdAt: new Date(), updatedAt: new Date(), version: 1 };

            mockRepository.findById.mockReturnValue(topic);
            
            const result = topicService.findShortestPath(1, 1);
            
            expect(result).toEqual([topic]);
        });

        it("should return the shortest path between two connected topics", () => {
            const t1: TopicModel = { id: 1, name: "A", content: "B", createdAt: new Date(), updatedAt: new Date(), version: 1 };
            const t2: TopicModel = { id: 2, name: "C", content: "D", createdAt: new Date(), updatedAt: new Date(), version: 1, parentTopicId: 1 };
            const t3: TopicModel = { id: 3, name: "E", content: "F", createdAt: new Date(), updatedAt: new Date(), version: 1, parentTopicId: 2 };

            mockRepository.findAll.mockReturnValue([t1, t2, t3]);

            const result = topicService.findShortestPath(1, 3);

            expect(result?.map(t => t.id)).toEqual([1, 2, 3]);
        });

        it("should return null if no path exists", () => {
            const t1: TopicModel = { id: 1, name: "A", content: "B", createdAt: new Date(), updatedAt: new Date(), version: 1 };
            const t2: TopicModel = { id: 2, name: "C", content: "D", createdAt: new Date(), updatedAt: new Date(), version: 1 };

            mockRepository.findAll.mockReturnValue([t1, t2]);

            const result = topicService.findShortestPath(1, 2);

            expect(result).toBeNull();
        });
    });
});
