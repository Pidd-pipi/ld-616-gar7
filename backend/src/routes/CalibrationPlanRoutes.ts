import { Router } from "express";
import { calibrationPlanController } from "../controllers/CalibrationPlanController";
import { rbacMiddleware, DISPATCHER_ROLES } from "../middlewares/rbacMiddleware";

const router = Router();

router.get("/", calibrationPlanController.list);
router.post("/", calibrationPlanController.create);
router.get("/:id", calibrationPlanController.detail);
// 暂停处置写操作仅调度员/管理员可执行
router.post("/:id/reassign", rbacMiddleware(DISPATCHER_ROLES), calibrationPlanController.reassign);
router.post("/:id/release-blocked", rbacMiddleware(DISPATCHER_ROLES), calibrationPlanController.releaseBlocked);

export default router;
