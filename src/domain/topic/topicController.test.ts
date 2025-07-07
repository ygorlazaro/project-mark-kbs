import { Request, Response } from "express";
import { TopicController } from "./topicController";
import { TopicService } from "./topicService";

function mockReqRes() {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const res = { status, json } as unknown as Response;
  const req = { params: {}, body: {} } as unknown as Request;

  return { req, res, status, json };
}

describe("TopicController", () => {
  let service: jest.Mocked<TopicService>;
  let controller: TopicController;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      getTopic: jest.fn(),
      getTopicTree: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<TopicService>;
    controller = new TopicController(service);
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("returns 400 for invalid input", () => {
      const { req, res, status, json } = mockReqRes();

      req.body = { invalid: true };
      controller.create(req, res);
      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith(expect.objectContaining({ errors: expect.any(Object) }));
    });

    it("returns 201 and topic for valid input", () => {
      const { req, res, status, json } = mockReqRes();
      const input = { name: "Test", content: "Content", version: 1, parentTopicId: undefined };
      const topic = { id: "1", ...input, createdAt: new Date(), updatedAt: new Date() };

      req.body = input;
      service.create.mockReturnValue(topic);
      controller.create(req, res);
      expect(service.create).toHaveBeenCalledWith(input);
      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith(topic);
    });
  });

  describe("get", () => {
    it("returns 404 if not found", () => {
      const { req, res, status, json } = mockReqRes();

      req.params = { id: "x" };
      service.getTopicTree.mockReturnValue(undefined);
      controller.findById(req, res);
      expect(service.getTopicTree).toHaveBeenCalledWith("x");
      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ message: "Topic not found" });
    });

    it("returns topic tree if found", () => {
      const { req, res, status, json } = mockReqRes();
      const topicTree = {
        id: "1",
        name: "A",
        content: "B",
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        parentTopicId: undefined,
        subtopics: [
          {
            id: "2",
            name: "Subtopic",
            content: "Subcontent",
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
            parentTopicId: "1",
            subtopics: []
          }
        ]
      };

      req.params = { id: "1" };
      service.getTopicTree.mockReturnValue(topicTree);
      controller.findById(req, res);
      expect(json).toHaveBeenCalledWith(topicTree);
      expect(status).not.toHaveBeenCalledWith(404);
    });
  });

  describe("put", () => {
    it("returns 400 for invalid input", () => {
      const { req, res, status, json } = mockReqRes();

      req.body = { bad: true };
      req.params = { id: "1" };
      controller.update(req, res);
      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith(expect.objectContaining({ errors: expect.any(Object) }));
    });

    it("returns 404 if update returns undefined", () => {
      const { req, res, status, json } = mockReqRes();

      req.body = { name: "N", content: "C", version: 2, parentTopicId: undefined };
      req.params = { id: "1" };
      service.update.mockReturnValue(undefined);
      controller.update(req, res);
      expect(service.update).toHaveBeenCalledWith("1", req.body);
      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ message: "Topic not found" });
    });

    it("returns updated topic if successful", () => {
      const { req, res, status, json } = mockReqRes();
      const updated = { id: "1", name: "N", content: "C", version: 2, createdAt: new Date(), updatedAt: new Date(), parentTopicId: undefined };

      req.body = { name: "N", content: "C", version: 2, parentTopicId: undefined };
      req.params = { id: "1" };
      service.update.mockReturnValue(updated);
      controller.update(req, res);
      expect(json).toHaveBeenCalledWith(updated);
      expect(status).not.toHaveBeenCalledWith(404);
    });
  });

  describe("delete", () => {
    it("returns 404 if not found", () => {
      const { req, res, status, json } = mockReqRes();

      req.params = { id: "1" };
      service.delete.mockReturnValue(false);
      controller.delete(req, res);
      expect(service.delete).toHaveBeenCalledWith("1");
      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ message: "Topic not found" });
    });

    it("returns 200 if deleted", () => {
      const { req, res, status, json } = mockReqRes();

      req.params = { id: "1" };
      service.delete.mockReturnValue(true);
      controller.delete(req, res);
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({ message: "Topic deleted successfully" });
    });
  });

  describe("list", () => {
    it("returns all topics", () => {
      const { req, res, json } = mockReqRes();
      const topics = [
        { id: "1", name: "A", content: "B", version: 1, createdAt: new Date(), updatedAt: new Date(), parentTopicId: undefined },
        { id: "2", name: "C", content: "D", version: 1, createdAt: new Date(), updatedAt: new Date(), parentTopicId: "1" },
      ];

      service.findAll.mockReturnValue(topics);
      controller.findAll(req, res);
      expect(service.findAll).toHaveBeenCalled();
      expect(json).toHaveBeenCalledWith(topics);
    });

    it("returns empty array if no topics", () => {
      const { req, res, json } = mockReqRes();

      service.findAll.mockReturnValue([]);
      controller.findAll(req, res);
      expect(json).toHaveBeenCalledWith([]);
    });
  });

  describe("findShortestPath", () => {
    it("returns 400 if from or to is missing", () => {
      const { req, res, status, json } = mockReqRes();

      req.query = { from: "1" };
      controller.findShortestPath(req, res);
      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ message: "Missing 'from' or 'to' query parameter" });
    });

    it("returns 404 if no path found", () => {
      const { req, res, status, json } = mockReqRes();

      req.query = { from: "1", to: "2" };
      service.findShortestPath = jest.fn().mockReturnValue(null);
      controller.findShortestPath(req, res);
      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ message: "No path found between the given topics" });
    });

    it("returns 200 and the path if found", () => {
      const { req, res, status, json } = mockReqRes();

      req.query = { from: "1", to: "2" };
      const path = [
        { id: "1", name: "A", content: "B", createdAt: new Date(), updatedAt: new Date(), version: 1, parentTopicId: undefined },
        { id: "2", name: "C", content: "D", createdAt: new Date(), updatedAt: new Date(), version: 1, parentTopicId: "1" }
      ];

      service.findShortestPath = jest.fn().mockReturnValue(path);
      controller.findShortestPath(req, res);
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(path);
    });
  });
});
