import { Router } from "express";
import { calibrationVendorController } from "../controllers/CalibrationVendorController";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";

const router = Router();

const READ_ROLES = ["dispatcher", "quality_manager", "calibrator", "auditor"];
const VENDOR_ADMIN_ROLES = ["quality_manager", "dispatcher"];

router.get("/", rbacMiddleware(READ_ROLES), calibrationVendorController.list);
router.post("/", rbacMiddleware(VENDOR_ADMIN_ROLES), calibrationVendorController.create);

// 候选机构查询：资质有效且服务范围匹配
router.get(
  "/eligible",
  rbacMiddleware(READ_ROLES),
  calibrationVendorController.listEligibleCandidates
);
// 暂停机构资质
router.post(
  "/:id/suspend",
  rbacMiddleware(VENDOR_ADMIN_ROLES),
  calibrationVendorController.suspend
);

export default router;
