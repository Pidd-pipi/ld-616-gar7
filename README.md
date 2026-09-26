# 设备计量校准排期 API 服务

面向实验室和工厂的计量设备校准周期管理 API，覆盖设备台账、校准计划、证书、超期预警和外部机构管理，并支持**校准机构资质暂停后的未开始计划处置**（转派 / 退回未派发）。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

启动后健康检查：<http://localhost:21116/health>

## 机构资质暂停后的处置流程

机构资质被暂停后，已经派给它的**未来计划不会自动执行或改派**，由调度员逐笔处置；已经开始执行的计划继续走原流程、不动。

1. `POST /api/calibration-vendor/:id/suspend` 暂停机构资质（质量经理），系统在该机构名下未开始计划上打暂停标记并写变更记录，状态/机构/设备/日期不变。
2. `GET /api/calibration-plan/suspension-pending?vendor_id=6` 列出该暂停机构名下**所有未开始计划**（仅 `PLANNED` / `ASSIGNED`），每笔同时返回资质有效且服务范围匹配的候选机构列表；进行中（`IN_PROGRESS` 及之后）的计划不出现。
3. 对每笔计划二选一：
   - 转派：`POST /api/calibration-plan/:id/reassign`，body `{target_vendor_id, handled_by, reason, expected_version}`。校验目标机构资质有效且 `service_scope` 覆盖设备类型；**设备（device_id）与日期（planned_date）不变**，原机构写入 `original_vendor_id`，处理人、原因留在计划上（`suspension_handled_by`、`suspension_reason`），状态仍为 `ASSIGNED`。
   - 无人能接：`POST /api/calibration-plan/:id/block-unassigned`，body `{handled_by, reason, block_reason, expected_version}`。若仍存在可承接机构会返回 `ELIGIBLE_VENDOR_EXISTS` 拒绝退回；确认无人可接时计划回到未派发 `PLANNED`、`assigned_vendor_id` 置空，并写明 `block_reason` 阻塞原因。
4. 变更可查：
   - `GET /api/calibration-plan/:id/changes` 单笔计划的变更时间线。
   - `GET /api/measuring-device/:id/calibration-history` 设备校准链路，内含该设备全部暂停处置变更明细。
5. 并发控制：两名调度员同时处理同一计划时只落地一次——计划级互斥锁串行化提交，配合 `version` 乐观锁（响应里的 `version` 回传为 `expected_version`），第二个请求得到 `409 PLAN_VERSION_CONFLICT` 或 `409 PLAN_ALREADY_HANDLED`。

```bash
# 示例：转派计划 1
curl -X POST http://localhost:21116/api/calibration-plan/1/reassign \
  -H "x-role: dispatcher" -H "x-user: dispatcher.zhao" -H "Content-Type: application/json" \
  -d '{"target_vendor_id":1,"handled_by":"dispatcher.zhao","reason":"原机构资质暂停","expected_version":1}'
```

> 本地开发态通过 `x-role` / `x-user` 请求头模拟 JWT 中的角色与用户（`admin` 放行一切，便于调试）。处置类接口要求 `dispatcher` 或 `quality_manager`，机构暂停要求 `quality_manager` 或 `dispatcher`，只读接口额外允许 `calibrator`、`auditor`。

## 访问地址或 CLI 示例

后端健康检查：<http://localhost:21116/health>

- `GET /api/calibration-plan/` 计划列表
- `GET /api/calibration-vendor/eligible?device_type=THERMAL&exclude_vendor_id=6` 候选机构
- `GET /api/measuring-device/:id` 设备详情（设备台账可查变更入口）

## 本地开发方式

- 后端：进入 `backend` 后执行 `npm install`，`npm run dev` 启动（tsx），接口统一挂在 `/api`，端口 `3000`。
- 构建：`npm run build`（输出到 `dist/`），`npm start` 运行产物。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | - |
| 后端 | Express + TypeScript（分层：route/controller/service/repository/model/DTO factory/validator） |
| 数据库 | PostgreSQL 15（schema 见 `database/init.sql`；当前运行态使用内存种子数据） |
| 部署 | Docker Compose |

## 项目目录结构

```text
backend/src/
├── routes/               # 按实体分文件（暂停处置、候选机构、设备链路路由）
├── controllers/          # 按实体分文件（controller 层捕获并映射 ServiceError）
├── services/             # 业务编排（CalibrationPlanService 含转派/退回核心规则）
├── models/               # 实体接口（含 PlanChangeRecord）
├── repositories/         # 内存数据访问层 + dataStore
├── middlewares/          # auth / rbac / auditLog / errorHandler / rateLimit / requestLogger
├── constants/            # 枚举、VendorStatus、PlanChangeType、错误码、日志模板、状态文案
├── constructors/         # 请求/响应 DTO 构造器（含暂停处置项、设备链路、变更记录）
├── validators/           # 入参校验（转派/退回、机构暂停）
├── utils/                # ServiceError、httpStatus、planLock、serviceScope、operationLogger、formatters
├── types/                # Payload 类型定义
└── config/               # 环境配置
```

## 环境变量说明

- `COMPOSE_PROJECT_NAME`: Compose 项目名，默认 `calibration-api`
- `BACKEND_PORT`: 后端端口，默认 `21116`
- `DB_PORT`: 数据库宿主机端口
- `DB_USER/DB_PASSWORD/DB_NAME`: 本地数据库凭据

## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: calibration-api`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-calibration-api}` 前缀。
- 数据库使用命名卷，避免绑定中文路径。
- 数据库配置 healthcheck，后端通过 `depends_on: condition: service_healthy` 等待就绪。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 枚举/常量出现位置清单

- DeviceCalibrationStatus: constants/DeviceCalibrationStatus、types、constructors、logTemplates、errorMessages、筛选器、展示/控制器均有引用。
- PlanStatus（`PLANNED/ASSIGNED/IN_PROGRESS/CERT_UPLOADED/CLOSED/CANCELLED`）:
  `constants/PlanStatus` 定义；`models/CalibrationPlan`、`repositories/CalibrationPlanRepository`（未开始筛选）、`services/CalibrationPlanService`、`services/CalibrationVendorService`、`utils/formatters`（中文文案）、`constructors/*DtoFactory`、`validators`、控制器/路由均有引用。
- CertificateResult: constants/CertificateResult、types、constructors、logTemplates、errorMessages、筛选器、展示/控制器均有引用。
- VendorStatus（`ACTIVE/SUSPENDED/REVOKED`）: `constants/VendorStatus`、`models/CalibrationVendor`、`repositories/CalibrationVendorRepository`、`services/CalibrationVendorService`/`CalibrationPlanService`、`utils/formatters`、DTO、校验响应。
- PlanChangeType（`VENDOR_SUSPENDED/REASSIGNED/BLOCKED_UNASSIGNED`）: `constants/PlanChangeType`、`models/PlanChangeRecord`、`types/PlanChangeRecordPayload`、`repositories/PlanChangeRecordRepository`、`services/*`、`constructors/PlanChangeRecordDtoFactory`、`utils/formatters`、`database/init.sql`。

## 暂停处置相关错误码

`PLAN_NOT_STARTED_REQUIRED`（已开始执行不可处置）、`VENDOR_NOT_SUSPENDED`、`VENDOR_ALREADY_SUSPENDED`、`TARGET_VENDOR_INACTIVE`、`SERVICE_SCOPE_MISMATCH`、`ELIGIBLE_VENDOR_EXISTS`、`NO_ELIGIBLE_VENDOR`、`PLAN_VERSION_CONFLICT`、`PLAN_ALREADY_HANDLED`、`REASON_REQUIRED`、`HANDLER_REQUIRED`。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误码/错误消息、DTO 构造器、校验器、格式化器被刻意拆散到多个目录。一次"机构暂停处置"改动同时触达：PlanStatus/VendorStatus/PlanChangeType 常量与类型、CalibrationPlan 与 CalibrationVendor 模型字段、plan_change_record 表与对应 repository/service、转派/退回校验器、计划锁与服务范围工具、操作日志模板、控制器与路由的 RBAC、DTO 构造器以及本 README。

## License

MIT
