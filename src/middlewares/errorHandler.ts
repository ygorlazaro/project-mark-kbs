import { Request, Response } from "express";

export function errorHandler(req: Request, res: Response) {
    const err = { message: undefined };

    res.status(500).json({ message: err.message || "Internal Server Error" });
}
