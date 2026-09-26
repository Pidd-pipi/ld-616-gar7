// 机构服务范围（逗号/斜杠/竖线分隔的设备类型清单）是否覆盖某台设备的类型
export const normalizeScope = (scope: string): string[] =>
  String(scope ?? "")
    .split(/[,/|、;；]/)
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean);

export const scopeCoversDeviceType = (serviceScope: string, deviceType: string): boolean =>
  normalizeScope(serviceScope).includes(String(deviceType ?? "").trim().toUpperCase());
