import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMeta } from "@/lib/site";
import ContactForm from "./ContactForm";

export const metadata = pageMeta({
  title: "聯絡我們",
  description: "對星語命理有任何建議、合作提案或個資權利行使需求？透過表單與我們聯繫。",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Breadcrumbs items={[{ name: "聯絡我們", path: "/contact" }]} />
      <h1 className="font-serif text-3xl font-bold text-gradient-gold">聯絡我們</h1>
      <p className="mt-2 text-ink-300">
        功能建議、內容勘誤、合作提案，或想行使個人資料相關權利，都歡迎留言給我們。
      </p>
      <ContactForm />
    </div>
  );
}
