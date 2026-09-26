import type { RequestHandler } from "express";

// 让 controller 里的 async 异常能冒泡到全局 errorHandlerMiddleware
export const asyncHandler =
  (handler: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next);
