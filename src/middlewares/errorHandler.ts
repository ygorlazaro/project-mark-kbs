import { Request, Response } from "express";

export function errorHandler(err: any, req: Request, res: Response) {
  console.error(err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    }
  });
}
