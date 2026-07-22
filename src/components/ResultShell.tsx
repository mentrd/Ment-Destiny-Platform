import type { ReactNode } from "react";
import ResultActions from "@/components/ResultActions";
import RelatedFeatures from "@/components/RelatedFeatures";
import Disclaimer from "@/components/Disclaimer";

interface Props {
  feature: string;
  featureName: string;
  title: string;
  summary: string;
  retryHref: string;
  children: ReactNode;
}

/** 結果頁外框：結果內容 + 動作列 + 免責聲明 + 相關推薦 */
export default function ResultShell({ feature, featureName, title, summary, retryHref, children }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="rise-stagger">{children}</div>
      <ResultActions
        feature={feature}
        featureName={featureName}
        title={title}
        summary={summary}
        retryHref={retryHref}
      />
      <Disclaimer />
      <RelatedFeatures slug={feature} />
    </div>
  );
}
