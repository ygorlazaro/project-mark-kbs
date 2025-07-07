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
      createResource: jest.fn(),
      getResource: jest.fn(),
      updateResource: jest.fn(),
      deleteResource: jest.fn(),
      getAllResources: jest.fn(),
      getResourcesByTopicId: jest.fn(),
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
      service.createResource.mockReturnValue(resource);
      controller.create(req, res);
      expect(service.createResource).toHaveBeenCalledWith(input);
      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith(resource);
    });
  });

  describe("get", () => {
    it("returns 404 if not found", () => {
      const { req, res, status, json } = mockReqRes();

      req.params = { id: "x" };
      service.getResource.mockReturnValue(undefined);
      controller.get(req, res);
      expect(service.getResource).toHaveBeenCalledWith("x");
      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ message: "Resource not found" });
    });

    it("returns resource if found", () => {
      const { req, res, status, json } = mockReqRes();
      const resource = { id: "1", topicId: "t1", url: "https://a.com", description: "desc", type: "video" as const, createdAt: new Date(), updatedAt: new Date() };

      req.params = { id: "1" };
      service.getResource.mockReturnValue(resource);
      controller.get(req, res);
      expect(json).toHaveBeenCalledWith(resource);
      expect(status).not.toHaveBeenCalledWith(404);
    });
  });

  describe("put", () => {
    it("returns 400 for invalid input", () => {
      const { req, res, status, json } = mockReqRes();

      req.body = { bad: true };
      req.params = { id: "1" };
      controller.put(req, res);
      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith(expect.objectContaining({ errors: expect.any(Object) }));
    });

    it("returns 404 if update returns undefined", () => {
      const { req, res, status, json } = mockReqRes();

      req.body = { topicId: "t1", url: "https://a.com", description: "desc", type: "video" as const };
      req.params = { id: "1" };
      service.updateResource.mockReturnValue(undefined);
      controller.put(req, res);
      expect(service.updateResource).toHaveBeenCalledWith("1", req.body);
      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ message: "Resource not found" });
    });

    it("returns updated resource if successful", () => {
      const { req, res, status, json } = mockReqRes();
      const updated = { id: "1", topicId: "t1", url: "https://a.com", description: "desc", type: "video" as const, createdAt: new Date(), updatedAt: new Date() };

      req.body = { topicId: "t1", url: "https://a.com", description: "desc", type: "video" as const };
      req.params = { id: "1" };
      service.updateResource.mockReturnValue(updated);
      controller.put(req, res);
      expect(json).toHaveBeenCalledWith(updated);
      expect(status).not.toHaveBeenCalledWith(404);
    });
  });

  describe("delete", () => {
    it("returns 404 if not found", () => {
      const { req, res, status, json } = mockReqRes();

      req.params = { id: "1" };
      service.deleteResource.mockReturnValue(false);
      controller.delete(req, res);
      expect(service.deleteResource).toHaveBeenCalledWith("1");
      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ message: "Resource not found" });
    });

    it("returns 200 if deleted", () => {
      const { req, res, status, json } = mockReqRes();

      req.params = { id: "1" };
      service.deleteResource.mockReturnValue(true);
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

      service.getAllResources.mockReturnValue(resources);
      controller.list(req, res);
      expect(service.getAllResources).toHaveBeenCalled();
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
