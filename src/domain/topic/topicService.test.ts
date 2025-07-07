import { ITopic } from "./topic";
import { TopicDataStore } from "./topicDataStore";
import { TopicRepository } from "./topicRepository";
import { TopicService } from "./topicService";

jest.mock("../../src/repositories/TopicRepository");

describe("TopicService", () => {
  let data: jest.Mocked<TopicDataStore>;
  let topicService: TopicService;
  let mockRepository: jest.Mocked<TopicRepository>;

  beforeEach(() => {
    data = new TopicDataStore() as jest.Mocked<TopicDataStore>;
    mockRepository = new TopicRepository(data) as jest.Mocked<TopicRepository>;
    topicService = new TopicService(mockRepository);
    jest.clearAllMocks();
  });

  describe("createTopic", () => {
    it("should create a topic and call repository.create", () => {
      const input = { name: "Test Topic", content: "Test Content", parentTopicId: undefined };
      const createdTopic: ITopic = {
        id: "uuid",
        name: input.name,
        content: input.content,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        parentTopicId: input.parentTopicId,
      };

      mockRepository.create.mockReturnValue(createdTopic);

      const result = topicService.createTopic(input);

      expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        name: input.name,
        content: input.content,
        parentTopicId: input.parentTopicId,
      }));
      expect(result).toEqual(createdTopic);
    });
  });

  describe("getTopic", () => {
    it("should return topic by id using repository.findById", () => {
      const topic: ITopic = {
        id: "1",
        name: "Topic 1",
        content: "Content 1",
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        parentTopicId: undefined,
      };

      mockRepository.findById.mockReturnValue(topic);

      const result = topicService.getTopic("1");

      expect(mockRepository.findById).toHaveBeenCalledWith("1");
      expect(result).toEqual(topic);
    });
  });

    describe("updateTopic", () => {
        it("should create a new version of the topic if parentTopicId exists", () => {
            const id = "1";
            const data = { name: "Updated Name", parentTopicId: "2" };
            const parentTopic: ITopic = {
                id: "2",
                name: "Parent Topic",
                content: "Parent Content",
                createdAt: new Date(),
                updatedAt: new Date(),
                version: 1,
                parentTopicId: undefined,
            };
            const newVersionTopic: ITopic = {
                id: "new-id",
                name: data.name!,
                content: "Old Content",
                createdAt: new Date(),
                updatedAt: new Date(),
                version: 2,
                parentTopicId: data.parentTopicId,
            };

            mockRepository.findById.mockImplementation((id) => (id === "2" ? parentTopic : undefined));
            mockRepository.update.mockReturnValue(newVersionTopic);

            const result = topicService.updateTopic(id, data);

            expect(mockRepository.findById).toHaveBeenCalledWith("2");
            expect(mockRepository.update).toHaveBeenCalledWith(id, data);
            expect(result).toEqual(newVersionTopic);
        });

        it("should return undefined if parentTopicId does not exist", () => {
            const id = "1";
            const data = { parentTopicId: "nonexistent" };

            mockRepository.findById.mockReturnValue(undefined);

            const result = topicService.updateTopic(id, data);

            expect(mockRepository.findById).toHaveBeenCalledWith("nonexistent");
            expect(result).toBeUndefined();
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it("should create a new version of the topic if parentTopicId is not provided", () => {
            const id = "1";
            const data = { name: "Updated Name" };
            const newVersionTopic: ITopic = {
                id: "new-id",
                name: data.name!,
                content: "Old Content",
                createdAt: new Date(),
                updatedAt: new Date(),
                version: 2,
                parentTopicId: undefined,
            };

            mockRepository.update.mockReturnValue(newVersionTopic);

            const result = topicService.updateTopic(id, data);

            expect(mockRepository.findById).not.toHaveBeenCalled();
            expect(mockRepository.update).toHaveBeenCalledWith(id, data);
            expect(result).toEqual(newVersionTopic);
        });
    });

    describe("getTopicVersion", () => {
        it("should return a specific version of a topic", () => {
            const parentTopicId = "1";
            const version = 2;
            const topicVersion: ITopic = {
                id: "2",
                name: "Topic Version 2",
                content: "Content Version 2",
                createdAt: new Date(),
                updatedAt: new Date(),
                version,
                parentTopicId,
            };

            mockRepository.findByParentIdAndVersion.mockReturnValue(topicVersion);

            const result = topicService.getTopicVersion(parentTopicId, version);

            expect(mockRepository.findByParentIdAndVersion).toHaveBeenCalledWith(parentTopicId, version);
            expect(result).toEqual(topicVersion);
        });
    });

  describe("deleteTopic", () => {
    it("should delete topic by id using repository.delete", () => {
      mockRepository.delete.mockReturnValue(true);

      const result = topicService.deleteTopic("1");

      expect(mockRepository.delete).toHaveBeenCalledWith("1");
      expect(result).toBe(true);
    });
  });

  describe("getAllTopics", () => {
    it("should return all topics using repository.findAll", () => {
      const topics: ITopic[] = [
        {
          id: "1",
          name: "Topic 1",
          content: "Content 1",
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          parentTopicId: undefined,
        },
        {
          id: "2",
          name: "Topic 2",
          content: "Content 2",
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          parentTopicId: "1",
        },
      ];

      mockRepository.findAll.mockReturnValue(topics);

      const result = topicService.getAllTopics();

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(topics);
    });
  });

  describe("findShortestPath", () => {
    it("should return the direct path if from and to are the same", () => {
      const topic: ITopic = {
        id: "1",
        name: "A",
        content: "B",
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        parentTopicId: undefined,
      };

      mockRepository.findAll.mockReturnValue([topic]);
      mockRepository.findById.mockReturnValue(topic);
      const result = topicService.findShortestPath("1", "1");

      expect(result).toEqual([topic]);
    });

    it("should return the shortest path between two connected topics", () => {
      const t1: ITopic = { id: "1", name: "A", content: "B", createdAt: new Date(), updatedAt: new Date(), version: 1, parentTopicId: undefined };
      const t2: ITopic = { id: "2", name: "C", content: "D", createdAt: new Date(), updatedAt: new Date(), version: 1, parentTopicId: "1" };
      const t3: ITopic = { id: "3", name: "E", content: "F", createdAt: new Date(), updatedAt: new Date(), version: 1, parentTopicId: "2" };

      mockRepository.findAll.mockReturnValue([t1, t2, t3]);
      const result = topicService.findShortestPath("1", "3");

      expect(result?.map(t => t.id)).toEqual(["1", "2", "3"]);
    });

    it("should return null if no path exists", () => {
      const t1: ITopic = { id: "1", name: "A", content: "B", createdAt: new Date(), updatedAt: new Date(), version: 1, parentTopicId: undefined };
      const t2: ITopic = { id: "2", name: "C", content: "D", createdAt: new Date(), updatedAt: new Date(), version: 1, parentTopicId: undefined };

      mockRepository.findAll.mockReturnValue([t1, t2]);
      const result = topicService.findShortestPath("1", "2");

      expect(result).toBeNull();
    });

    it("should return null if either topic does not exist", () => {
      mockRepository.findAll.mockReturnValue([]);
      const result = topicService.findShortestPath("x", "y");

      expect(result).toBeNull();
    });
  });
});
