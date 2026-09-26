# 设备计量校准排期 API 服务

面向实验室和工厂的计量设备校准周期管理 API，覆盖设备台账、校准计划、证书、超期预警和外部机构管理。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

后端健康检查：<http://localhost:21116/health>

后端健康检查：<http://localhost:21116/health>


## 本地开发方式


- 后端：进入 `backend` 后按技术栈运行开发命令，接口统一挂在 `/api`。


## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | - |
| 后端 | NestJS + TypeScript + TypeORM |
| 数据库 | PostgreSQL 15 |
| 部署 | Docker Compose |

## 项目目录结构

```text

backend/src/routes, controllers, services, models, repositories, middlewares, constants, constructors, utils, types, config
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
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 枚举/常量出现位置清单

- DeviceCalibrationStatus: constants/DeviceCalibrationStatus、types/DeviceCalibrationStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- PlanStatus: constants/PlanStatus、types/PlanStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
  - 子分组 `UNSTARTED_PLAN_STATUSES`（PLANNED/ASSIGNED）与 `STARTED_PLAN_STATUSES`（IN_PROGRESS/CERT_UPLOADED/CLOSED）定义在 constants/PlanStatus，服务层 `CalibrationPlanService.isUnstarted`、机构暂停处置清单 `CalibrationVendorService.listUnstartedPlans` 均引用：未开始计划才可改派/退回，已开始计划继续走原流程。
- CertificateResult: constants/CertificateResult、types/CertificateResult、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- VendorStatus: constants/VendorStatus（ACTIVE 资质有效 / SUSPENDED 资质暂停），被 CalibrationVendor 模型、seed、CalibrationVendorService（suspend/triage 校验）、CalibrationPlanService（改派目标资质校验）、utils/formatters 引用。
- PlanChangeType: constants/PlanChangeType（REASSIGN 改派 / RELEASE_BLOCKED 退回未派发），被 PlanChangeRecord 模型、types/PlanChangeRecordPayload、constructors/PlanChangeRecordDtoFactory、repositories/PlanChangeRecordRepository、services/PlanChangeRecordService、utils/formatters、设备详情接口引用。

## 机构资质暂停后的处置流程

资质被暂停的机构不会自动取消未来计划（避免设备送到现场才被拒收），由调度员逐笔处置：

1. `POST /api/calibration-vendor/{id}/suspend` 暂停机构资质（DISPATCHER/ADMIN）。
2. `GET /api/calibration-vendor/{id}/triage-plans` 列出该机构名下所有**未开始**计划（PLANNED/ASSIGNED），每条附带设备详情与当前「资质有效且服务范围匹配」的可承接机构候选；IN_PROGRESS 及以后状态不在清单内，继续走原流程。
3. 调度员逐笔处理：
   - 有人接：`POST /api/calibration-plan/{id}/reassign`，body `{ target_vendor_id, reason, expected_version }`。设备（device_id）与日期（planned_date）不变；原机构 original_vendor_id、处理人 handled_by、原因 handled_reason 留在计划上，状态置为 ASSIGNED。
   - 没人接：`POST /api/calibration-plan/{id}/release-blocked`，body `{ blocked_reason, expected_version }`。计划回到未派发（PLANNED，assigned_vendor_id 清空）并写明阻塞原因。
4. 两个调度员同时处理同一计划时，按 `version` 乐观锁控制：第二笔用旧 `expected_version` 提交返回 409 `PLAN_VERSION_CONFLICT`，落地只发生一次。
5. 每次处置写入 plan_change_record 流水，可通过 `GET /api/measuring-device/{id}/detail`（设备详情）或 `GET /api/plan-change-record/plan/{planId}` 查询，含原/新机构名称、原因、处理人与版本前后值。

当前用户通过请求头传递：`x-role`（DISPATCHER/ADMIN 可写）、`x-user-id`、`x-user-name`。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
