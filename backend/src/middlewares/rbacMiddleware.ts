import type { RequestHandler } from "express";
import { HttpError } from "../utils/httpErrors";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import type { AuthUser } from "../types/AuthUser";

// 暂停机构处置类写操作仅允许调度员（DISPATCHER）或管理员（ADMIN）
export const rbacMiddleware =
  (roles: string[] = []): RequestHandler =>
  (req, _res, next) => {
    const user = (req as unknown as { user?: AuthUser }).user;
    if (!user) {
      next(new HttpError(401, ERROR_CODES.AUTH_REQUIRED, ERROR_MESSAGES.AUTH_REQUIRED));
      return;
    }
    if (roles.length > 0 && !roles.includes(user.role)) {
      next(new HttpError(403, ERROR_CODES.RBAC_DENIED, `${ERROR_MESSAGES.RBAC_DENIED}: ${user.role}`));
      return;
    }
    next();
  };

export const DISPATCHER_ROLES = ["DISPATCHER", "ADMIN"];
