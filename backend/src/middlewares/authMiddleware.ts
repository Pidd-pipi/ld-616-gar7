import type { RequestHandler } from "express";

export interface AuthUser {
  id: number;
  username: string;
  role: string;
}

export const authMiddleware: RequestHandler = (req, _res, next) => {
  const username = req.header("x-user") ?? "admin";
  const user: AuthUser = {
    id: Number(req.header("x-user-id") ?? 1),
    username,
    role: req.header("x-role") ?? "admin"
  };
  (req as unknown as { user: AuthUser }).user = user;
  next();
};
