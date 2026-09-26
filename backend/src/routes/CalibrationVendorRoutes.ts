import { Router } from "express";
import { calibrationVendorController } from "../controllers/CalibrationVendorController";
import { rbacMiddleware, DISPATCHER_ROLES } from "../middlewares/rbacMiddleware";

const router = Router();

router.get("/", calibrationVendorController.list);
router.post("/", calibrationVendorController.create);
// 暂停机构资质 / 查看暂停后的未开始计划处置清单
router.post("/:id/suspend", rbacMiddleware(DISPATCHER_ROLES), calibrationVendorController.suspend);
router.get("/:id/triage-plans", calibrationVendorController.triageList);

export default router;
