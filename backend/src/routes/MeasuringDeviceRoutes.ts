import { Router } from "express";
import { measuringDeviceController } from "../controllers/MeasuringDeviceController";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";

const router = Router();

const READ_ROLES = ["dispatcher", "quality_manager", "calibrator", "auditor"];
const DEVICE_ADMIN_ROLES = ["quality_manager", "dispatcher"];

router.get("/", rbacMiddleware(READ_ROLES), measuringDeviceController.list);
router.post("/", rbacMiddleware(DEVICE_ADMIN_ROLES), measuringDeviceController.create);
router.get("/:id", rbacMiddleware(READ_ROLES), measuringDeviceController.detail);
router.get(
  "/:id/calibration-history",
  rbacMiddleware(READ_ROLES),
  measuringDeviceController.calibrationHistory
);

export default router;
