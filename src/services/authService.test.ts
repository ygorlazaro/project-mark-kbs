import { signToken, verifyToken } from "./authService";
import { UserModel } from "../domain/user/userModel";

describe("AuthService", () => {
  const user: UserModel = {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    role: "Admin",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  it("should sign and verify a token successfully", async () => {
    const token = await signToken(user);

    expect(token).toBeDefined();

    const payload = await verifyToken(token);

    expect(payload.userId).toBe(user.id);
    expect(payload.name).toBe(user.name);
    expect(payload.email).toBe(user.email);
    expect(payload.role).toBe(user.role);
  });

  it("should throw an error for an invalid token", async () => {
    const invalidToken = "invalid-token";

    await expect(verifyToken(invalidToken)).rejects.toThrow();
  });
});
