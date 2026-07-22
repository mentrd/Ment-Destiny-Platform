import { pageMeta } from "@/lib/site";
import LoginClient from "./LoginClient";

export const metadata = pageMeta({
  title: "會員登入",
  description: "登入星語命理會員，跨裝置同步您的測算歷史紀錄與收藏結果。",
  path: "/login",
  noindex: true,
});

export default function LoginPage() {
  return <LoginClient />;
}
