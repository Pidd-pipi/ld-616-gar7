/**
 * 服务范围匹配：机构 service_scope 以逗号分隔的设备类型编码列表维护，
 * 如 "THERMAL,PRESSURE" 可承接热学、压力类设备。
 */
export const scopeCoversDevice = (serviceScope: string, deviceType: string): boolean => {
  const scopes = serviceScope
    .split(",")
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean);
  return scopes.includes(deviceType.trim().toUpperCase());
};
