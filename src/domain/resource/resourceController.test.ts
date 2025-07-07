import { ResourceController } from "./resourceController";
import { ResourceService } from "./resourceService";
import { Request, Response } from "express";

function mockReqRes() {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const res = { status, json } as unknown as Response;
  const req = { params: {}, body: {} } as unknown as Request;

  return { req, res, status, json };
}

describe("ResourceController", () => {
  let service: jest.Mocked<ResourceService>;
  let controller: ResourceController;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findByIdsByTopicId: jest.fn(),
    } as unknown as jest.Mocked<ResourceService>;
    controller = new ResourceController(service);
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

    it("returns 201 and resource for valid input", () => {
      const { req, res, status, json } = mockReqRes();
      const input = { topicId: "t1", url: "https://a.com", description: "desc", type: "video" as const };
      const resource = { ...input, id: "1", createdAt: new Date(), updatedAt: new Date() };

      req.body = input;
      service.create.mockReturnValue(resource);
      controller.create(req, res);
      expect(service.create).toHaveBeenCalledWith(input);
      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith(resource);
    });
  });

  describe("get", () => {
    it("returns 404 if not found", () => {
      const { req, res, status, json } = mockReqRes();

      req.params = { id: "x" };
      service.findById.mockReturnValue(undefined);
      controller.findById(req, res);
      expect(service.findById).toHaveBeenCalledWith("x");
      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ message: "Resource not found" });
    });

    it("returns resource if found", () => {
      const { req, res, status, json } = mockReqRes();
      const resource = { id: "1", topicId: "t1", url: "https://a.com", description: "desc", type: "video" as const, createdAt: new Date(), updatedAt: new Date() };

      req.params = { id: "1" };
      service.findById.mockReturnValue(resource);
      controller.findById(req, res);
      expect(json).toHaveBeenCalledWith(resource);
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

      req.body = { topicId: "t1", url: "https://a.com", description: "desc", type: "video" as const };
      req.params = { id: "1" };
      service.update.mockReturnValue(undefined);
      controller.update(req, res);
      expect(service.update).toHaveBeenCalledWith("1", req.body);
      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ message: "Resource not found" });
    });

    it("returns updated resource if successful", () => {
      const { req, res, status, json } = mockReqRes();
      const updated = { id: "1", topicId: "t1", url: "https://a.com", description: "desc", type: "video" as const, createdAt: new Date(), updatedAt: new Date() };

      req.body = { topicId: "t1", url: "https://a.com", description: "desc", type: "video" as const };
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
      expect(json).toHaveBeenCalledWith({ message: "Resource not found" });
    });

    it("returns 200 if deleted", () => {
      const { req, res, status, json } = mockReqRes();

      req.params = { id: "1" };
      service.delete.mockReturnValue(true);
      controller.delete(req, res);
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({ message: "Resource deleted successfully" });
    });
  });

  describe("list", () => {
    it("returns all resources", () => {
      const { req, res, json } = mockReqRes();
      const resources = [
        { id: "1", topicId: "t1", url: "https://a.com", description: "desc", type: "video" as const, createdAt: new Date(), updatedAt: new Date() },
        { id: "2", topicId: "t2", url: "https://b.com", description: "desc2", type: "article" as const, createdAt: new Date(), updatedAt: new Date() },
      ];

      service.findAll.mockReturnValue(resources);
      controller.findAll(req, res);
      expect(service.findAll).toHaveBeenCalled();
      expect(json).toHaveBeenCalledWith(resources);
    });
  });

  describe("listByTopic", () => {
    it("returns resources for a topic", () => {
      const { req, res, json } = mockReqRes();
      const resources = [
        { id: "1", topicId: "t1", url: "https://a.com", description: "desc", type: "video" as const, createdAt: new Date(), updatedAt: new Date() },
      ];

      req.params = { topicId: "t1" };
      service.getResourcesByTopicId.mockReturnValue(resources);
      controller.listByTopic(req, res);
      expect(service.getResourcesByTopicId).toHaveBeenCalledWith("t1");
      expect(json).toHaveBeenCalledWith(resources);
    });
  });
});
