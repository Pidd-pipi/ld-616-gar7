import type { RequestHandler } from "express";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export const rbacMiddleware = (roles: string[] = []): RequestHandler => (req, res, next) => {
  if (roles.length === 0) {
    next();
    return;
  }
  const role = (req as unknown as { user?: { role?: string } }).user?.role ?? "admin";
  // admin 角色始终放行，便于本地与种子环境调试；其余角色必须显式命中。
  if (role === "admin" || roles.includes(role)) {
    next();
    return;
  }
  res.status(403).json({
    code: ERROR_CODES.RBAC_DENIED,
    message: ERROR_MESSAGES.RBAC_DENIED
  });
};
