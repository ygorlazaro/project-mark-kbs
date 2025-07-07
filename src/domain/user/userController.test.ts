import { Request, Response } from "express";
import { UserModel } from "./userModel";
import { UserController } from "./userController";
import { UserService } from "./userService";
import * as authService from "../../services/authService";

jest.mock("../../services/authService");
const mockedAuthService = authService as jest.Mocked<typeof authService>;

function mockReqRes() {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const send = jest.fn();
  const res = { status, json, send } as unknown as Response;
  const req = { params: {}, body: {} } as unknown as Request;

  return { req, res, status, json, send };
}

describe("UserController", () => {
  let service: jest.Mocked<UserService>;
  let controller: UserController;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UserService>;
    controller = new UserController(service);
    jest.clearAllMocks();
    mockedAuthService.signToken.mockClear();
  });

  describe("create", () => {
    it("returns 400 for invalid input", () => {
      const { req, res, status, json } = mockReqRes();

      req.body = { invalid: true };
      controller.create(req, res);
      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(Array) }));
    });

    it("returns 201 and user for valid input", () => {
      const { req, res, status, json } = mockReqRes();
      const input: Omit<UserModel, "id" | "createdAt" | "updatedAt"> = { name: "Test", email: "test@example.com", role: "Admin" };
      const user: UserModel = { id: 1, ...input, createdAt: new Date(), updatedAt: new Date() };

      req.body = input;
      (service.create as jest.Mock).mockReturnValue(user);
      controller.create(req, res);
      expect(service.create).toHaveBeenCalledWith(input);
      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith(user);
    });
  });

  describe("findById", () => {
    it("returns 400 for invalid id format", () => {
      const { req, res, status, json } = mockReqRes();

      req.params = { id: "x" };
      controller.findById(req, res);
      expect(service.findById).not.toHaveBeenCalled();
      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ error: "Invalid ID format" });
    });

    it("returns 404 if not found", () => {
      const { req, res, status, json } = mockReqRes();

      req.params = { id: "1" };
      (service.findById as jest.Mock).mockReturnValue(undefined);
      controller.findById(req, res);
      expect(service.findById).toHaveBeenCalledWith(1);
      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("returns user if found", () => {
      const { req, res, json } = mockReqRes();
      const user: UserModel = { id: 1, name: "A", email: "a@b.com", role: "Admin", createdAt: new Date(), updatedAt: new Date() };

      req.params = { id: "1" };
      (service.findById as jest.Mock).mockReturnValue(user);
      controller.findById(req, res);
      expect(service.findById).toHaveBeenCalledWith(1);
      expect(json).toHaveBeenCalledWith(user);
    });
  });

  describe("signIn", () => {
    it("returns 400 if email is missing", async () => {
      const { req, res, status, json } = mockReqRes();

      req.body = {};
      await controller.signIn(req, res);
      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ error: "Email is required" });
    });

    it("returns 401 if user is not found", async () => {
      const { req, res, status, json } = mockReqRes();

      req.body = { email: "notfound@test.com" };
      (service.findByEmail as jest.Mock).mockReturnValue(undefined);
      await controller.signIn(req, res);
      expect(service.findByEmail).toHaveBeenCalledWith("notfound@test.com");
      expect(status).toHaveBeenCalledWith(401);
      expect(json).toHaveBeenCalledWith({ error: "Invalid email or user not found" });
    });

        it("returns 500 if token signing fails", async () => {
        const { req, res, status, json } = mockReqRes();
        const user: UserModel = { id: 1, name: "A", email: "a@b.com", role: "Admin", createdAt: new Date(), updatedAt: new Date() };

        req.body = { email: "a@b.com" };
        (service.findByEmail as jest.Mock).mockReturnValue(user);
        mockedAuthService.signToken.mockRejectedValue(new Error("Signing failed"));
        await controller.signIn(req, res);
        expect(status).toHaveBeenCalledWith(500);
        expect(json).toHaveBeenCalledWith({ error: "Failed to sign token" });
    });

        it("returns 200 with token on success", async () => {
        const { req, res, json } = mockReqRes();
        const user: UserModel = { id: 1, name: "A", email: "a@b.com", role: "Admin", createdAt: new Date(), updatedAt: new Date() };

        req.body = { email: "a@b.com" };
        (service.findByEmail as jest.Mock).mockReturnValue(user);
        mockedAuthService.signToken.mockResolvedValue("test-token");
        await controller.signIn(req, res);
        expect(json).toHaveBeenCalledWith({ token: "test-token" });
    });
  });

  describe("update", () => {
    it("returns 400 for invalid id format", () => {
      const { req, res, status, json } = mockReqRes();

      req.params = { id: "x" };
      req.body = { name: "New Name" };
      controller.update(req, res);
      expect(service.update).not.toHaveBeenCalled();
      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ error: "Invalid ID format" });
    });

    it("returns 400 for invalid input", () => {
        const { req, res, status, json } = mockReqRes();

        req.params = { id: "1" };
        req.body = { email: "invalid-email" };
        controller.update(req, res);
        expect(status).toHaveBeenCalledWith(400);
        expect(json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(Array) }));
    });

    it("returns 404 if user to update is not found", () => {
        const { req, res, status, json } = mockReqRes();

        req.params = { id: "1" };
        req.body = { name: "New Name" };
        (service.update as jest.Mock).mockReturnValue(undefined);
        controller.update(req, res);
        expect(service.update).toHaveBeenCalledWith(1, { name: "New Name" });
        expect(status).toHaveBeenCalledWith(404);
        expect(json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("returns 200 with updated user on success", () => {
        const { req, res, json } = mockReqRes();
        const updatedUser: UserModel = { id: 1, name: "Updated", email: "a@b.com", role: "Admin", createdAt: new Date(), updatedAt: new Date() };

        req.params = { id: "1" };
        req.body = { name: "Updated" };
        (service.update as jest.Mock).mockReturnValue(updatedUser);
        controller.update(req, res);
        expect(service.update).toHaveBeenCalledWith(1, { name: "Updated" });
        expect(json).toHaveBeenCalledWith(updatedUser);
    });
  });

  describe("delete", () => {
    it("returns 400 for invalid id format", () => {
      const { req, res, status, json } = mockReqRes();

      req.params = { id: "x" };
      controller.delete(req, res);
      expect(service.delete).not.toHaveBeenCalled();
      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ error: "Invalid ID format" });
    });

    it("returns 404 if user to delete is not found", () => {
        const { req, res, status, json } = mockReqRes();

        req.params = { id: "1" };
        (service.delete as jest.Mock).mockReturnValue(false);
        controller.delete(req, res);
        expect(service.delete).toHaveBeenCalledWith(1);
        expect(status).toHaveBeenCalledWith(404);
        expect(json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("returns 204 on success", () => {
        const { req, res, status, send } = mockReqRes();

        req.params = { id: "1" };
        (service.delete as jest.Mock).mockReturnValue(true);
        controller.delete(req, res);
        expect(service.delete).toHaveBeenCalledWith(1);
        expect(status).toHaveBeenCalledWith(204);
        expect(send).toHaveBeenCalled();
    });
  });
});
