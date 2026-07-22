import { pageMeta } from "@/lib/site";
import RegisterClient from "./RegisterClient";

export const metadata = pageMeta({
  title: "註冊會員",
  description: "免費註冊星語命理會員，保存您的測算歷史紀錄與收藏，跨裝置隨時回顧。",
  path: "/register",
  noindex: true,
});

export default function RegisterPage() {
  return <RegisterClient />;
}
