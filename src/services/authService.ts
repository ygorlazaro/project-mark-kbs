import * as jose from "jose";
import { UserModel } from "../domain/user/userModel";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export interface AuthPayload extends jose.JWTPayload {
  userId: number;
  role: "Admin" | "Editor" | "Viewer";
  email: string;
  name: string;
}

export const signToken = async (user: UserModel): Promise<string> => {
  const payload: AuthPayload = {
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  };

  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);

  return jwt;
};

export const verifyToken = async (token: string): Promise<AuthPayload> => {
  try {
    const { payload } = await jose.jwtVerify<AuthPayload>(token, secret);

    return payload;
  } catch {
    throw new Error("Invalid or expired token");
  }
};
