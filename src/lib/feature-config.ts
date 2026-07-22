import "server-only";
import { readContent } from "@/lib/db";
import { FEATURES, type FeatureDef, type FeatureCategory } from "@/lib/features";

export interface FeatureConfig {
  hidden: string[];
  order: string[];
}

/** 套用後台「功能管理」設定（上下架與排序）後的功能清單 */
export async function getVisibleFeatures(): Promise<FeatureDef[]> {
  const config = await readContent<FeatureConfig>("features", { hidden: [], order: [] });
  const hidden = new Set(config.hidden ?? []);
  const orderIndex = new Map((config.order ?? []).map((slug, i) => [slug, i]));
  return FEATURES.filter((f) => !hidden.has(f.slug)).sort((a, b) => {
    const ia = orderIndex.has(a.slug) ? orderIndex.get(a.slug)! : 999;
    const ib = orderIndex.has(b.slug) ? orderIndex.get(b.slug)! : 999;
    return ia - ib;
  });
}

export async function getVisibleByCategory(cat: FeatureCategory): Promise<FeatureDef[]> {
  return (await getVisibleFeatures()).filter((f) => f.category === cat);
}
