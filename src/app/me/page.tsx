import { pageMeta } from "@/lib/site";
import MeClient from "./MeClient";

export const metadata = pageMeta({
  title: "會員中心",
  description: "管理您的星語命理會員資料，查看歷史紀錄與收藏，跨裝置同步您的測算結果。",
  path: "/me",
  noindex: true,
});

export default function MePage() {
  return <MeClient />;
}
