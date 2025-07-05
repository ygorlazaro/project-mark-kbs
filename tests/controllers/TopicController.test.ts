import { TopicController } from "../../src/controllers/TopicController";
import { TopicService } from "../../src/services/TopicService";
import { Request, Response } from "express";
jest.mock("../../src/services/TopicService");

describe("TopicController", () => {
  let topicService: jest.Mocked<TopicService>;
  let topicController: TopicController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    topicService = new TopicService(null as any) as jest.Mocked<TopicService>;
    topicController = new TopicController(topicService);

    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock } as any));

    res = {
      status: statusMock,
      json: jsonMock,
    };

    req = {
      params: {},
      body: {},
    };

    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should return 400 if validation fails", () => {
      req.body = { invalid: "data" };

      topicController.create(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ errors: expect.any(Object) }));
    });

    it("should create topic and return 201 with topic data", () => {
      const topicInput = { name: "Test", content: "Content", parentTopicId: undefined };
      const createdTopic = { id: "1", ...topicInput, createdAt: new Date(), updatedAt: new Date(), version: 1 };

      req.body = topicInput;
      topicService.createTopic.mockReturnValue(createdTopic);

      topicController.create(req as Request, res as Response);

      expect(topicService.createTopic).toHaveBeenCalledWith(topicInput);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(createdTopic);
    });
  });

  describe("get", () => {
    it("should return 404 if topic not found", () => {
      req.params = { id: "1" };
      topicService.getTopic.mockReturnValue(undefined);

      topicController.get(req as Request, res as Response);

      expect(topicService.getTopic).toHaveBeenCalledWith("1");
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Topic not found" });
    });

    it("should return topic data if found", () => {
      const topic = { id: "1", name: "Test", content: "Content", createdAt: new Date(), updatedAt: new Date(), version: 1, parentTopicId: undefined };
      req.params = { id: "1" };
      topicService.getTopic.mockReturnValue(topic);

      topicController.get(req as Request, res as Response);

      expect(topicService.getTopic).toHaveBeenCalledWith("1");
      expect(jsonMock).toHaveBeenCalledWith(topic);
      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  describe("put", () => {
    it("should return 400 if validation fails", () => {
      req.body = { invalid: "data" };
      req.params = { id: "1" };

      topicController.put(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ errors: expect.any(Object) }));
    });

    it("should return 404 if update returns undefined", () => {
      req.body = { name: "Updated", content: "Updated content", parentTopicId: undefined };
      req.params = { id: "1" };
      topicService.updateTopic.mockReturnValue(undefined);

      topicController.put(req as Request, res as Response);

      expect(topicService.updateTopic).toHaveBeenCalledWith("1", req.body);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Topic not found" });
    });

    it("should update topic and return updated data", () => {
      const updatedTopic = { id: "1", name: "Updated", content: "Updated content", createdAt: new Date(), updatedAt: new Date(), version: 2, parentTopicId: undefined };
      req.body = { name: "Updated", content: "Updated content", parentTopicId: undefined };
      req.params = { id: "1" };
      topicService.updateTopic.mockReturnValue(updatedTopic);

      topicController.put(req as Request, res as Response);

      expect(topicService.updateTopic).toHaveBeenCalledWith("1", req.body);
      expect(jsonMock).toHaveBeenCalledWith(updatedTopic);
      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should return 404 if delete returns false", () => {
      req.params = { id: "1" };
      topicService.deleteTopic.mockReturnValue(false);

      topicController.delete(req as Request, res as Response);

      expect(topicService.deleteTopic).toHaveBeenCalledWith("1");
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Topic not found" });
    });

    it("should return 200 if delete returns true", () => {
      req.params = { id: "1" };
      topicService.deleteTopic.mockReturnValue(true);

      topicController.delete(req as Request, res as Response);

      expect(topicService.deleteTopic).toHaveBeenCalledWith("1");
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Topic deleted successfully" });
    });
  });

  describe("list", () => {
    it("should return all topics", () => {
      const topics = [
        { id: "1", name: "Topic 1", content: "Content 1", createdAt: new Date(), updatedAt: new Date(), version: 1, parentTopicId: undefined },
        { id: "2", name: "Topic 2", content: "Content 2", createdAt: new Date(), updatedAt: new Date(), version: 1, parentTopicId: "1" },
      ];
      topicService.getAllTopics.mockReturnValue(topics);

      topicController.list(req as Request, res as Response);

      expect(topicService.getAllTopics).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith(topics);
      expect(statusMock).not.toHaveBeenCalled();
    });
  });
});
