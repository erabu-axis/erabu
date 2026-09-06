import type { ScoreDisplayStatus } from "@/types/axis";

/**
 * confirmed/provisional/insufficientの意味を、ユーザーが自然に理解できる短い注釈文にする。
 * scoreDisplayStatus等の内部用語はここでは一切表示せず、日本語の説明文のみを出す。
 */
export function ScoreStatusNote({
  status,
  missingAxisLabels,
}: {
  /** nullは「採点データ自体がない（採点準備中）」を意味し、注釈は出さない */
  status: ScoreDisplayStatus | null;
  /** status==="insufficient"のとき、不足しているAXISのラベル一覧（例：["静音性","価格対効果"]） */
  missingAxisLabels?: string[];
}) {
  if (status === null) {
    return null;
  }

  if (status === "confirmed") {
    return <p className="mt-1.5 text-xs text-brand-inkSoft">必要な評価情報を満たしています。</p>;
  }

  if (status === "provisional") {
    return (
      <p className="mt-1.5 text-xs text-brand-accent2">
        一部のAXISの評価情報が不足しているため、確認できている情報のみで算出した参考スコアです。
      </p>
    );
  }

  const detail =
    missingAxisLabels && missingAxisLabels.length > 0
      ? `${missingAxisLabels.join("・")}の評価情報が不足しているため、総合スコアは表示していません。`
      : "評価情報が不足しているため、総合スコアは表示していません。";

  return <p className="mt-1.5 text-xs text-brand-inkSoft">{detail}</p>;
}
