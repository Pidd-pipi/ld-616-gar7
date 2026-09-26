/* eslint-disable no-console */
import { LOG_TEMPLATES } from "../constants/logTemplates";

type LogEntity = keyof typeof LOG_TEMPLATES;
type LogAction<E extends LogEntity> = keyof (typeof LOG_TEMPLATES)[E];

export interface OperationActor {
  id: number;
  username: string;
  role: string;
}

export const writeOperationLog = <E extends LogEntity>(
  entity: E,
  action: LogAction<E>,
  actor: OperationActor,
  targetId: string | number,
  extra?: Record<string, unknown>
): void => {
  const template = LOG_TEMPLATES[entity][action];
  console.info(
    JSON.stringify({
      level: "info",
      kind: "operation",
      action: template,
      actor: actor.username,
      role: actor.role,
      target: `${entity}#${targetId}`,
      at: new Date().toISOString(),
      ...(extra ?? {})
    })
  );
};
