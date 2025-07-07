import { Request, Response } from "express";
import { UserInput, IUser } from "./user";
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

  describe("createUser", () => {
    it("returns 400 for invalid input", () => {
      const { req, res, status, json } = mockReqRes();

      req.body = { invalid: true };
      controller.createUser(req, res);
      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(Array) }));
    });

    it("returns 201 and user for valid input", () => {
      const { req, res, status, json } = mockReqRes();
      const input: UserInput = { name: "Test", email: "test@example.com", role: "Admin" };
      const user: IUser = { id: "1", ...input, createdAt: new Date() };

      req.body = input;
      (service.createUser as jest.Mock).mockReturnValue(user);
      controller.createUser(req, res);
      expect(service.createUser).toHaveBeenCalledWith(input);
      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith(user);
    });
  });

  describe("getUserById", () => {
    it("returns 404 if not found", () => {
      const { req, res, status, json } = mockReqRes();

      req.params = { id: "x" };
      (service.getUserById as jest.Mock).mockReturnValue(undefined);
      controller.getUserById(req, res);
      expect(service.getUserById).toHaveBeenCalledWith("x");
      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("returns user if found", () => {
      const { req, res, status, json } = mockReqRes();
      const user: IUser = { id: "1", name: "A", email: "a@b.com", role: "Admin", createdAt: new Date() };

      req.params = { id: "1" };
      (service.getUserById as jest.Mock).mockReturnValue(user);
      controller.getUserById(req, res);
      expect(json).toHaveBeenCalledWith(user);
      expect(status).not.toHaveBeenCalledWith(404);
    });
  });
});
