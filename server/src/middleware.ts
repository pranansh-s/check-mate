import { NextFunction, Request, Response } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import admin from "firebase-admin";

import { ForbiddenError, ServiceError, UnauthorizedError } from "./utils/error.js";
import { ZodError } from "zod";

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
  console.error("[ROUTE_ERROR]", req.url, err.name, err.message);
  if(err instanceof ZodError) {
    res.status(400).json({ error: err.issues[0].message })
  } else if (err instanceof ServiceError) {
    res.status(400).json({ error: err.message });
  } else if (err instanceof UnauthorizedError) {
    res.status(401).json({ error: err.message });
  } else if (err instanceof ForbiddenError) {
    res.status(403).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleAuthValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return next(new ForbiddenError);
  }

  try {
    const user = await admin.auth().verifyIdToken(token);
    req.userId = user.uid;
    next();
  }
  catch (err) {
    next(new UnauthorizedError);
  }
};
