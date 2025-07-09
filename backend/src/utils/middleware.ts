import { NextFunction, Request, Response } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { ServiceError, UnauthorizedError } from "../models/error.js";

export const appCors = cors({
  origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true,
});

export const appRateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 100,
  message: "Too many requests. Please try again later",
});

export const handleRouteErrors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("[ROUTE_ERROR]", req.url, err.message);

  if (err instanceof ServiceError) {
    res.status(400).json({ error: err.message });
  } else if (err instanceof UnauthorizedError) {
    res.status(401).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleAuthValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.headers["authorization"]?.split(" ")[1];
  if (!userId) {
    next(new UnauthorizedError());
    return;
  }

  req.userId = userId;
  next();
};
