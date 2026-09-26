import { Router } from "express";
import { planChangeRecordController } from "../controllers/PlanChangeRecordController";

const router = Router();

// 暂停处置流水：设备详情可查，也可按计划查
router.get("/", planChangeRecordController.list);
router.get("/plan/:planId", planChangeRecordController.listByPlan);

export default router;
