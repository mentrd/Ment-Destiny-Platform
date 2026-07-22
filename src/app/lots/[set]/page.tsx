import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import LotsClient from "@/components/lots/LotsClient";
import { LOT_SET_KEYS, LOT_SETS, type LotSetKey } from "@/lib/engines/lots-data";
import { pageMeta } from "@/lib/site";

function isSetKey(v: string): v is LotSetKey {
  return (LOT_SET_KEYS as readonly string[]).includes(v);
}

export function generateStaticParams() {
  return LOT_SET_KEYS.map((set) => ({ set }));
}

export async function generateMetadata({ params }: { params: Promise<{ set: string }> }): Promise<Metadata> {
  const { set } = await params;
  if (!isSetKey(set)) return {};
  const s = LOT_SETS[set];
  return pageMeta({
    title: `${s.name}線上求籤（共 ${s.count} 首）`,
    description: `${s.deity}${s.name}免費線上求籤：默想問題、搖籤、擲筊確認，即得籤詩原文、吉凶分級、白話解說、主題解讀與建議。${s.intro}結果僅供娛樂與民俗文化參考。`,
    path: `/lots/${set}`,
  });
}

export default async function LotSetPage({ params }: { params: Promise<{ set: string }> }) {
  const { set } = await params;
  if (!isSetKey(set)) notFound();
  const s = LOT_SETS[set];

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-8">
        <Breadcrumbs
          items={[
            { name: "線上抽籤", path: "/lots" },
            { name: s.name, path: `/lots/${set}` },
          ]}
        />
        <header className="text-center">
          <span aria-hidden className="text-4xl">{s.icon}</span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-gradient-gold">{s.name}</h1>
          <p className="mt-1 text-sm text-ink-500">{s.deity}・共 {s.count} 首</p>
        </header>
      </div>
      <LotsClient setKey={set} />
    </>
  );
}
