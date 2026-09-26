import { Router } from "express";
import { calibrationPlanController } from "../controllers/CalibrationPlanController";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";

const router = Router();

const DISPATCHER_ROLES = ["dispatcher", "quality_manager", "auditor"];
const DISPATCH_HANDLING_ROLES = ["dispatcher", "quality_manager"];

router.get("/", rbacMiddleware(DISPATCHER_ROLES), calibrationPlanController.list);
router.post("/", rbacMiddleware(DISPATCH_HANDLING_ROLES), calibrationPlanController.create);

// 暂停处置：先列出暂停机构名下所有未开始计划（静态路由必须在 :id 之前注册）
router.get(
  "/suspension-pending",
  rbacMiddleware(DISPATCHER_ROLES),
  calibrationPlanController.listPendingSuspension
);
router.get(
  "/:id/changes",
  rbacMiddleware(DISPATCHER_ROLES),
  calibrationPlanController.listChanges
);
router.post(
  "/:id/reassign",
  rbacMiddleware(DISPATCH_HANDLING_ROLES),
  calibrationPlanController.reassign
);
router.post(
  "/:id/block-unassigned",
  rbacMiddleware(DISPATCH_HANDLING_ROLES),
  calibrationPlanController.blockUnassigned
);

export default router;
