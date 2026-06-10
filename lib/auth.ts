import { mutate } from "swr";

const TOKEN_KEY = "datahub_token";

export const token = {
  get: (): string | null => (typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY)),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// 登出/会话失效必须连 SWR 缓存一起清:否则换账号登录后会先闪现上一账号的缓存数据
export function clearSession() {
  token.clear();
  mutate(() => true, undefined, { revalidate: false });
}
