import Link from "next/link";
import { axisDefinitions, getProfile } from "@/lib/data";
import { getHighlightAxis } from "@/lib/axisScore";
import type { Comparison } from "@/types/comparison";

/**
 * 比較記事のカード表示。トップページの「比較記事で選ぶ」と/articles一覧の両方で使う。
 * comparisons.jsonのtitle/slug/updatedAtと、axisScoreProfiles.jsonのpersona名・重みだけから
 * 組み立てる（記事本文・要約文の新規追加はしない）。
 */
export function ArticleCard({ comparison }: { comparison: Comparison }) {
  const profile = getProfile(comparison.personaProfileId);
  const highlightAxis = getHighlightAxis(profile);
  const highlightLabel = highlightAxis
    ? axisDefinitions.find((d) => d.axisKey === highlightAxis)?.label
    : null;

  return (
    <Link
      href={`/articles/${comparison.slug}`}
      className="flex flex-col rounded-lg border border-brand-line bg-brand-card p-5 shadow-sm hover:border-brand-accent"
    >
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-accent2">比較記事</p>
      <h3 className="mb-2 text-lg font-bold leading-snug text-brand-ink">{comparison.title}</h3>
      <p className="mb-4 flex-1 text-sm text-brand-inkSoft">
        「{profile.name}」を重視した比較{highlightLabel && `（${highlightLabel}を最重視）`}
      </p>
      <p className="mb-3 text-xs text-brand-inkSoft">最終確認日：{comparison.updatedAt}</p>
      <span className="text-sm font-bold text-brand-accent underline">記事を読む →</span>
    </Link>
  );
}
