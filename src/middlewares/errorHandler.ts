// Error handling middleware

import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error & { statusCode?: number; cause?: string },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status((err as any).statusCode || 500).json({
    error: true,
    status: "error",
    message: err.message || "Internal Server Error",
    cause: err.cause || "Unknown",
    body: req.body || {},
    stack: err.stack || "",
  });
};
