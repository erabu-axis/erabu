import Link from "next/link";
import { axisDefinitions } from "@/lib/data";
import { getAxisDisplayDescription } from "@/lib/article";
import type { AxisKey } from "@/types/axis";

export interface AxisChecklistItem {
  axisKey: AxisKey;
  /** この軸で読者が確認すべきポイントの解説（数値の一律基準にはしない） */
  guidance: string;
  /** 深掘り記事がある場合のみ設定する。未作成の記事へのリンクは作らない */
  relatedArticle?: { slug: string; label: string };
}

/**
 * 「買う前に確認したい5つのポイント」用の共通コンポーネント。
 * 各軸のラベル・説明・評価項目（criteria）はaxisDefinitions.jsonを一次ソースとして動的に取得するため、
 * ルーブリックが更新されても本文を手直しする必要がない。
 * guidance（実際の解説文）と関連記事リンクは呼び出し側が記事ごとに用意する。
 */
export function ArticleAxisChecklist({ items }: { items: AxisChecklistItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const def = axisDefinitions.find((d) => d.axisKey === item.axisKey);
        if (!def) return null;
        const description = getAxisDisplayDescription(def);

        return (
          <div key={item.axisKey} className="rounded-lg border border-brand-line bg-brand-card p-5">
            <div className="mb-2 flex items-baseline gap-2">
              <span className="font-heading text-lg font-bold text-brand-accent">{index + 1}</span>
              <h3 className="text-lg font-bold text-brand-ink">{def.label}</h3>
            </div>
            <p className="mb-2 text-sm text-brand-inkSoft">{description}</p>
            <p className="mb-3 text-xs text-brand-inkSoft">
              チェックポイント：{def.criteria.map((c) => c.label).join("・")}
            </p>
            <p className="text-sm text-brand-ink">{item.guidance}</p>
            {item.relatedArticle && (
              <Link
                href={`/articles/${item.relatedArticle.slug}`}
                className="mt-3 inline-block text-sm font-bold text-brand-accent underline"
              >
                {item.relatedArticle.label}を詳しく見る →
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
