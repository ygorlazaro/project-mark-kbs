import { Request, Response } from "express";
import { TopicController } from "./topicController";
import { TopicService } from "./topicService";
import { TopicModel } from "./topicModel";

// Mock Express request and response objects
function mockReqRes() {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status, json } as unknown as Response;
    const req = { params: {}, body: {}, query: {} } as unknown as Request;

    return { req, res, status, json };
}

describe("TopicController", () => {
    let service: jest.Mocked<TopicService>;
    let controller: TopicController;

    beforeEach(() => {
        // Mock the TopicService with all its methods
        service = {
            create: jest.fn(),
            getTopicTree: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAll: jest.fn(),
            findShortestPath: jest.fn(),
        } as unknown as jest.Mocked<TopicService>;
        controller = new TopicController(service);
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should return 400 for invalid input", () => {
            const { req, res, status, json } = mockReqRes();

            req.body = { name: "" }; // Invalid: name is empty
            controller.create(req, res);
            expect(status).toHaveBeenCalledWith(400);
            expect(json).toHaveBeenCalledWith(expect.objectContaining({ errors: expect.any(Object) }));
        });

        it("should return 201 and the created topic for valid input", () => {
            const { req, res, status, json } = mockReqRes();
            const input = { name: "Test", content: "Content" };
            const topic = { id: 1, ...input, version: 1, createdAt: new Date(), updatedAt: new Date() } as TopicModel;

            req.body = input;
            service.create.mockReturnValue(topic);
            controller.create(req, res);

            expect(service.create).toHaveBeenCalledWith(input);
            expect(status).toHaveBeenCalledWith(201);
            expect(json).toHaveBeenCalledWith(topic);
        });
    });

    describe("findById", () => {
        it("should return 400 for an invalid ID format", () => {
            const { req, res, status, json } = mockReqRes();

            req.params = { id: "abc" };
            controller.findById(req, res);
            expect(status).toHaveBeenCalledWith(400);
            expect(json).toHaveBeenCalledWith({ message: "Invalid ID format" });
        });

        it("should return 404 if topic is not found", () => {
            const { req, res, status, json } = mockReqRes();

            req.params = { id: "999" };
            service.getTopicTree.mockReturnValue(undefined);
            controller.findById(req, res);
            expect(service.getTopicTree).toHaveBeenCalledWith(999);
            expect(status).toHaveBeenCalledWith(404);
            expect(json).toHaveBeenCalledWith({ message: "Topic not found" });
        });

        it("should return 200 and the topic tree if found", () => {
            const { req, res, status, json } = mockReqRes();
            const topicTree = {
                id: 1,
                name: "A",
                content: "B",
                subtopics: [],
            } as any;

            req.params = { id: "1" };
            service.getTopicTree.mockReturnValue(topicTree);
            controller.findById(req, res);
            expect(service.getTopicTree).toHaveBeenCalledWith(1);
            expect(status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalledWith(topicTree);
        });
    });

    describe("update", () => {
        it("should return 400 for an invalid ID format", () => {
            const { req, res, status, json } = mockReqRes();

            req.params = { id: "abc" };
            controller.update(req, res);
            expect(status).toHaveBeenCalledWith(400);
            expect(json).toHaveBeenCalledWith({ message: "Invalid ID format" });
        });

        it("should return 400 for invalid input data", () => {
            const { req, res, status, json } = mockReqRes();

            req.params = { id: "1" };
            req.body = { name: "" }; // Invalid: name is empty
            controller.update(req, res);
            expect(status).toHaveBeenCalledWith(400);
            expect(json).toHaveBeenCalledWith(expect.objectContaining({ errors: expect.any(Object) }));
        });

        it("should return 404 if topic to update is not found", () => {
            const { req, res, status, json } = mockReqRes();
            const input = { name: "Updated Name" };

            req.params = { id: "999" };
            req.body = input;
            service.update.mockReturnValue(undefined);
            controller.update(req, res);
            expect(service.update).toHaveBeenCalledWith(999, input);
            expect(status).toHaveBeenCalledWith(404);
            expect(json).toHaveBeenCalledWith({ message: "Topic not found" });
        });

        it("should return 200 and the updated topic if successful", () => {
            const { req, res, json } = mockReqRes();
            const input = { name: "Updated Name" };
            const updatedTopic = { id: 1, ...input } as TopicModel;

            req.params = { id: "1" };
            req.body = input;
            service.update.mockReturnValue(updatedTopic);
            controller.update(req, res);

            expect(service.update).toHaveBeenCalledWith(1, input);
            expect(json).toHaveBeenCalledWith(updatedTopic);
        });
    });

    describe("delete", () => {
        it("should return 400 for an invalid ID format", () => {
            const { req, res, status, json } = mockReqRes();

            req.params = { id: "abc" };
            controller.delete(req, res);
            expect(status).toHaveBeenCalledWith(400);
            expect(json).toHaveBeenCalledWith({ message: "Invalid ID format" });
        });

        it("should return 404 if topic to delete is not found", () => {
            const { req, res, status, json } = mockReqRes();

            req.params = { id: "999" };
            service.delete.mockReturnValue(false);
            controller.delete(req, res);
            expect(service.delete).toHaveBeenCalledWith(999);
            expect(status).toHaveBeenCalledWith(404);
            expect(json).toHaveBeenCalledWith({ message: "Topic not found" });
        });

        it("should return 200 if deleted successfully", () => {
            const { req, res, status, json } = mockReqRes();

            req.params = { id: "1" };
            service.delete.mockReturnValue(true);
            controller.delete(req, res);
            expect(service.delete).toHaveBeenCalledWith(1);
            expect(status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalledWith({ message: "Topic deleted successfully" });
        });
    });

    describe("findAll", () => {
        it("should return all topics", () => {
            const { req, res, json } = mockReqRes();
            const topics = [
                { id: 1, name: "A", content: "B" },
                { id: 2, name: "C", content: "D", parentTopicId: 1 },
            ] as TopicModel[];

            service.findAll.mockReturnValue(topics);
            controller.findAll(req, res);
            expect(service.findAll).toHaveBeenCalled();
            expect(json).toHaveBeenCalledWith(topics);
        });
    });

    describe("findShortestPath", () => {
        it("should return 400 if startId or endId is missing", () => {
            const { req, res, status, json } = mockReqRes();

            req.query = { startId: "1" }; // Missing endId
            controller.findShortestPath(req, res);
            expect(status).toHaveBeenCalledWith(400);
            expect(json).toHaveBeenCalledWith({ message: "Missing 'startId' or 'endId' query parameter" });
        });

        it("should return 400 for invalid ID format", () => {
            const { req, res, status, json } = mockReqRes();

            req.query = { startId: "1", endId: "abc" };
            controller.findShortestPath(req, res);
            expect(status).toHaveBeenCalledWith(400);
            expect(json).toHaveBeenCalledWith({ message: "Invalid ID format" });
        });

        it("should return 404 if no path is found", () => {
            const { req, res, status, json } = mockReqRes();

            req.query = { startId: "1", endId: "2" };
            service.findShortestPath.mockReturnValue(null);
            controller.findShortestPath(req, res);
            expect(service.findShortestPath).toHaveBeenCalledWith(1, 2);
            expect(status).toHaveBeenCalledWith(404);
            expect(json).toHaveBeenCalledWith({ message: "No path found between the given topics" });
        });

        it("should return 200 and the path if found", () => {
            const { req, res, status, json } = mockReqRes();

            req.query = { startId: "1", endId: "2" };
            const path = [{ id: 1 }, { id: 2 }] as TopicModel[];

            service.findShortestPath.mockReturnValue(path);
            controller.findShortestPath(req, res);
            expect(service.findShortestPath).toHaveBeenCalledWith(1, 2);
            expect(status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalledWith(path);
        });
    });
});
