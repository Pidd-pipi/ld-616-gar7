import type { RequestHandler } from "express";
import type { AuthUser } from "../types/AuthUser";

// HTTP 头按 latin-1 传输，中文用户名需要还原为 UTF-8
const decodeHeader = (value: string): string => Buffer.from(value, "latin1").toString("utf8").trim();

// 纯本地服务：从请求头解析当前用户（x-user-id / x-user-name / x-role），缺省为 admin
export const authMiddleware: RequestHandler = (req, _res, next) => {
  const user: AuthUser = {
    id: decodeHeader(req.header("x-user-id") ?? "1"),
    name: decodeHeader(req.header("x-user-name") ?? "admin"),
    role: decodeHeader(req.header("x-role") ?? "ADMIN").toUpperCase()
  };
  (req as unknown as { user: AuthUser }).user = user;
  next();
};
