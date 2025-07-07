import { Request, Response } from "express";
import { UserModel } from "./userModel";
import { UserController } from "./userController";
import { UserService } from "./userService";

function mockReqRes() {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const res = { status, json } as unknown as Response;
  const req = { params: {}, body: {} } as unknown as Request;

  return { req, res, status, json };
}

describe("UserController", () => {
  let service: jest.Mocked<UserService>;
  let controller: UserController;

  beforeEach(() => {
    service = {
      createUser: jest.fn(),
      getUserById: jest.fn(),
      getAllUsers: jest.fn(),
      deleteUser: jest.fn(),
    } as unknown as jest.Mocked<UserService>;
    controller = new UserController(service);
    jest.clearAllMocks();
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
      const user: UserModel = { id: "1", ...input, createdAt: new Date(), updatedAt: new Date() };

      req.body = input;
      (service.create as jest.Mock).mockReturnValue(user);
      controller.create(req, res);
      expect(service.create).toHaveBeenCalledWith(input);
      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith(user);
    });
  });

  describe("findById", () => {
    it("returns 404 if not found", () => {
      const { req, res, status, json } = mockReqRes();

      req.params = { id: "x" };
      (service.findById as jest.Mock).mockReturnValue(undefined);
      controller.findById(req, res);
      expect(service.findById).toHaveBeenCalledWith("x");
      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("returns user if found", () => {
      const { req, res, status, json } = mockReqRes();
      const user: UserModel = { id: "1", name: "A", email: "a@b.com", role: "Admin", createdAt: new Date(), updatedAt: new Date() };

      req.params = { id: "1" };
      (service.findById as jest.Mock).mockReturnValue(user);
      controller.findById(req, res);
      expect(json).toHaveBeenCalledWith(user);
      expect(status).not.toHaveBeenCalledWith(404);
    });
  });
});
