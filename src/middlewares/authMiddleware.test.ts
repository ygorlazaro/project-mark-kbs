import { Response, NextFunction } from "express";
import { authMiddleware, AuthenticatedRequest } from "./authMiddleware";
import { signToken } from "../services/authService";
import { UserModel } from "../domain/user/userModel";

describe("AuthMiddleware", () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  const nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      headers: {},
      method: "GET",
      path: "/",
      baseUrl: "/api/user",
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it("should call next if token is valid and user has required role", async () => {
    const user: UserModel = { id: 1, name: "Test", email: "test@test.com", role: "Admin", createdAt: new Date(), updatedAt: new Date() };
    const token = await signToken(user);

    mockRequest.headers = { authorization: `Bearer ${token}` };

    await authMiddleware(["Admin"])(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it("should return 401 if no token is provided", async () => {
    await authMiddleware(["Admin"])(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Authorization token is required" });
  });

  it("should return 403 if user does not have required role", async () => {
    const user: UserModel = { id: 1, name: "Test", email: "test@test.com", role: "Viewer", createdAt: new Date(), updatedAt: new Date() };
    const token = await signToken(user);

    mockRequest.headers = { authorization: `Bearer ${token}` };

    await authMiddleware(["Admin"])(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Forbidden: Insufficient permissions" });
  });

  it("should return 403 if a non-admin tries to create a user", async () => {
    const user: UserModel = { id: 1, name: "Test", email: "test@test.com", role: "Editor", createdAt: new Date(), updatedAt: new Date() };
    const token = await signToken(user);

    mockRequest.headers = { authorization: `Bearer ${token}` };
    mockRequest.method = "POST";

    await authMiddleware(["Editor"])(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Forbidden: Only admins can create users" });
  });

  it("should return 403 if a viewer tries to perform a restricted action", async () => {
    const user: UserModel = { id: 1, name: "Test", email: "test@test.com", role: "Viewer", createdAt: new Date(), updatedAt: new Date() };
    const token = await signToken(user);

    mockRequest.headers = { authorization: `Bearer ${token}` };
    mockRequest.method = "PUT";

    await authMiddleware(["Viewer"])(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Forbidden: Viewers cannot perform this action" });
  });
});
