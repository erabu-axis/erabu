import type { ScoreDisplayStatus } from "@/types/axis";

/**
 * normalizedScoreとscoreDisplayStatusから、ユーザー画面に出す表示文字列を組み立てる。
 * normalizedScore自体（内部データ）は変更・削除しない。表示のしかただけをここで分離する。
 *
 * - confirmed: スコアをそのまま返す（例："97"）
 * - provisional: 参考値であることを明示する（例："参考 68"）
 * - insufficient: スコアを主表示せず、評価情報不足である旨を返す
 */
export function formatAxisScoreDisplay(
  normalizedScore: number | null,
  scoreDisplayStatus: ScoreDisplayStatus
): string {
  if (scoreDisplayStatus === "insufficient" || normalizedScore === null) {
    return "評価情報不足";
  }
  if (scoreDisplayStatus === "provisional") {
    return `参考 ${normalizedScore}`;
  }
  return `${normalizedScore}`;
}
