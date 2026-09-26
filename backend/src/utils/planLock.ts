/**
 * 同一校准计划的串行锁。两名调度员同时处理同一笔暂停计划时，
 * 后到的处理排队等待，落地后再以版本号/处理记录判定冲突，保证只落地一次。
 */
const lockedKeys = new Set<string>();
const waiters: Record<string, Array<() => void>> = {};

const acquire = (key: string): Promise<void> => {
  if (!lockedKeys.has(key)) {
    lockedKeys.add(key);
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    if (!waiters[key]) {
      waiters[key] = [];
    }
    waiters[key].push(resolve);
  });
};

const release = (key: string): void => {
  const next = waiters[key]?.shift();
  if (next) {
    next();
    return;
  }
  lockedKeys.delete(key);
};

export const withPlanLock = async <T>(planId: number, task: () => Promise<T> | T): Promise<T> => {
  const key = `calibration-plan:${planId}`;
  await acquire(key);
  try {
    return await task();
  } finally {
    release(key);
  }
};
