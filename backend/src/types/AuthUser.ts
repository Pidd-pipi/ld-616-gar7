// 鉴权后的请求人信息：authMiddleware 从请求头解析
export interface AuthUser {
  id: string;
  name: string;
  role: string;
}
