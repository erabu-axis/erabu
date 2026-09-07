import type { ProductWithScore } from "@/lib/data";
import type { AxisKey } from "@/types/axis";

/**
 * 「confirmed」というラベルだけでは、2商品が同じ条件で比較できるとは限らない。
 * calculateDisplayAwareAxisScoreは、insufficientなAXISを除外し、残ったAXIS間でpersona weightを
 * 再正規化するため、除外されたAXISの集合（＝どのAXISの重みで総合点を計算したか）が商品ごとに異なりうる。
 * 除外AXISの集合が同じ商品同士だけが、同じ重み配分で計算された総合点として直接比較できる。
 *
 * このモジュールは採点結果（calculateDisplayAwareAxisScoreの出力）を読むだけで、
 * 採点式・weight・scoreDisplayStatusの判定ロジックには一切手を加えない。
 */

export interface RankableGroup {
  /** 除外されたAXISの集合（空配列＝persona weightで定義された全AXISを使って算出） */
  excludedAxisKeys: AxisKey[];
  /** totalScore降順でソート済み。このグループ内でのみ連番の順位を付けてよい */
  items: ProductWithScore[];
}

export interface GroupedRanking {
  /** 除外AXIS数が少ない順（＝より多くの情報にもとづく総合評価が先） */
  groups: RankableGroup[];
  /** overallScoreDisplayStatus==="insufficient"、または採点データ自体がない商品。順位を付けない */
  unranked: ProductWithScore[];
}

/**
 * real商品（displayAwareResult経由）のitemsを、同じ条件（除外AXISの集合）でグループ化する。
 * 各グループ内はtotalScore降順。グループ間の順序は「除外AXISが少ない＝confirmedに近い」を先頭にする。
 * sample商品（axisScoreResult経由、displayAwareResultを持たない）は常にunrankedへ回す
 * （このモジュールは実商品の表示専用ロジックのため、新しい扱いを増やさない）。
 */
export function groupComparableRankings(items: ProductWithScore[]): GroupedRanking {
  const unranked: ProductWithScore[] = [];
  const byKey = new Map<string, RankableGroup>();

  for (const item of items) {
    const result = item.displayAwareResult;
    if (!result || result.overallScoreDisplayStatus === "insufficient" || result.totalScore === null) {
      unranked.push(item);
      continue;
    }

    const excludedAxisKeys = result.breakdown
      .filter((b) => !b.includedInTotal)
      .map((b) => b.axisKey)
      .sort();
    const key = excludedAxisKeys.join(",");

    if (!byKey.has(key)) {
      byKey.set(key, { excludedAxisKeys, items: [] });
    }
    byKey.get(key)!.items.push(item);
  }

  const groups = Array.from(byKey.values());
  for (const group of groups) {
    group.items.sort(
      (a, b) => (b.displayAwareResult!.totalScore ?? 0) - (a.displayAwareResult!.totalScore ?? 0)
    );
  }
  groups.sort((a, b) => a.excludedAxisKeys.length - b.excludedAxisKeys.length);

  return { groups, unranked };
}
