import { Request, Response, NextFunction } from "express";
import { verifyToken, AuthPayload } from "../services/authService";

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export const authMiddleware = (requiredRoles: Array<"Admin" | "Editor" | "Viewer">) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Authorization token is required" });

      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = await verifyToken(token);

      req.user = payload;

      if (requiredRoles.length > 0 && !requiredRoles.includes(payload.role)) {
        res.status(403).json({ error: "Forbidden: Insufficient permissions" });

        return;
      }

      // Special rule: Only Admins can create other users
      if (req.method === "POST" && req.path === "/" && payload.role !== "Admin") {
        const userControllerPaths = ["/api/user"];

        if(userControllerPaths.includes(req.baseUrl)){
          res.status(403).json({ error: "Forbidden: Only admins can create users" });

          return;
        }
      }

      // Editors can do POST, PUT, DELETE
      if (["POST", "PUT", "DELETE"].includes(req.method) && payload.role === "Viewer") {
         const editorPaths = ["/api/user", "/api/topic", "/api/resource"];

         if(editorPaths.includes(req.baseUrl)){
            if(req.method === "POST" && req.path === "/signin"){
              return next();
            }

            res.status(403).json({ error: "Forbidden: Viewers cannot perform this action" });

            return;
         }
      }

      next();
    } catch  {
      res.status(401).json({ error: "Invalid or expired token" });

      return;
    }
  };
};
