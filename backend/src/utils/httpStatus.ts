import type { Response } from "express";
import { ServiceError } from "./ServiceError";

export const sendServiceError = (res: Response, error: unknown): Response => {
  if (error instanceof ServiceError) {
    return res.status(error.status).json({ code: error.code, message: error.message });
  }
  const message = error instanceof Error ? error.message : "internal server error";
  return res.status(500).json({ code: "INTERNAL_ERROR", message });
};
