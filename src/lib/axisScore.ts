import type {
  AxisDefinition,
  AxisKey,
  AxisScoreCriterion,
  AxisScoreProfile,
  ProductAxisScores,
  ScoreDisplayStatus,
} from "@/types/axis";

export interface AxisScoreBreakdownItem {
  axisKey: AxisKey;
  normalizedScore: number;
  weight: number;
  contribution: number;
}

export interface AxisScoreResult {
  productId: string;
  profileId: string;
  totalScore: number;
  breakdown: AxisScoreBreakdownItem[];
}

/**
 * 商品の軸別スコアを、プロファイル（軸ごとの重み）に従って合算する。
 * MVPの `default` プロファイルは全軸0.2ずつの均等重みなので単純平均と同じ結果になるが、
 * 将来「狭小住宅向け」等の重み付きプロファイルを渡すだけでAXIS SCOREを切り替えられる。
 */
export function calculateAxisScore(
  productScores: ProductAxisScores,
  profile: AxisScoreProfile
): AxisScoreResult {
  const totalWeight =
    Object.values(profile.weights).reduce((sum, w) => sum + (w ?? 0), 0) || 1;

  const breakdown: AxisScoreBreakdownItem[] = productScores.scores.map((entry) => {
    const weight = profile.weights[entry.axisKey] ?? 0;
    return {
      axisKey: entry.axisKey,
      normalizedScore: entry.normalizedScore,
      weight,
      contribution: (entry.normalizedScore * weight) / totalWeight,
    };
  });

  const totalScore = breakdown.reduce((sum, item) => sum + item.contribution, 0);

  return {
    productId: productScores.productId,
    profileId: profile.id,
    totalScore: Math.round(totalScore * 10) / 10,
    breakdown,
  };
}

/**
 * プロファイル内で最も重みの大きい軸を返す。
 * `default` のように重みが均等（同率首位）な場合はハイライトすべき単一の軸がないため null を返す。
 */
export function getHighlightAxis(profile: AxisScoreProfile): AxisKey | null {
  const entries = Object.entries(profile.weights) as [AxisKey, number][];
  if (entries.length === 0) return null;

  const maxWeight = Math.max(...entries.map(([, weight]) => weight));
  const topAxes = entries.filter(([, weight]) => weight === maxWeight);

  return topAxes.length === 1 ? topAxes[0][0] : null;
}

/**
 * ============================================================
 * AXIS SCORE™ 公式採点基準 v1.0 — 採点エンジン
 * ============================================================
 * ここから下の関数は、1つのAXISのcriteria（採点項目）配列から
 * normalizedScoreとevaluationCoverageを算出するための新しい計算処理。
 *
 * 重要：この採点エンジンはまだ calculateAxisScore には接続していない。
 * calculateAxisScore は引き続き AxisScoreEntry.normalizedScore
 * （人間が確定した値）をそのまま読む既存の挙動のままであり、
 * 本エンジンの追加によって既存商品のAXIS SCORE™表示は一切変わらない。
 *
 * 将来、商品のcriteriaに一次情報つきでスコアを積み上げ、人間が確認した
 * 段階で、ここで算出した値を AxisScoreEntry.normalizedScore に
 * 反映する運用（別タスク）を想定している。
 */

export interface AxisCriteriaScoreResult {
  /** 0-100に正規化したAXISスコア。verifiedなcriteriaが1件もない場合は未採点としてnull */
  normalizedScore: number | null;
  /** 評価充足率（0-100）。確認済みcriteriaの配点合計 ÷ 全criteria配点合計 × 100 */
  evaluationCoverage: number;
  /** 確認済み（verified）criteriaの配点合計 */
  confirmedWeight: number;
  /** 確認済みcriteriaの獲得点合計 */
  earnedPoints: number;
  /** このAXISの全criteriaの配点合計（通常100） */
  totalWeight: number;
}

/**
 * criteria配列から、そのAXISのnormalizedScoreとevaluationCoverageを算出する。
 *
 * 前提：各criterionの`score`は0〜100の評価値ではなく、0〜weightの絶対獲得点である
 * （例：weight=25の項目ならscoreは0〜25）。この関数はその前提のもとで
 * 「獲得点合計 ÷ 配点合計 × 100」により、AXIS全体を0〜100に正規化する。
 *
 * - status が "verified" の項目のみを採点対象にする。
 * - "unpublished"（未公表）・"pending-review"（未レビュー）は0点扱いにせず、
 *   算出対象から除外する（配点合計にも獲得点にも含めない）。
 * - normalizedScore = 確認済みcriteriaの獲得点合計 ÷ 確認済みcriteriaの配点合計 × 100
 *   例）本来100点分のcriteriaのうち80点分のみ確認でき、獲得点が64点なら
 *       64 ÷ 80 × 100 = 80
 * - evaluationCoverage は confirmedWeight ÷ totalWeight で、スコアには影響しない
 *   （coverageが低い商品を自動的に減点する処理は行わない）。
 */
export function deriveAxisScoreFromCriteria(
  criteria: AxisScoreCriterion[]
): AxisCriteriaScoreResult {
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
  const verified = criteria.filter((c) => c.status === "verified");
  const confirmedWeight = verified.reduce((sum, c) => sum + c.weight, 0);
  const earnedPoints = verified.reduce((sum, c) => sum + (c.score ?? 0), 0);

  const normalizedScore =
    confirmedWeight > 0 ? Math.round((earnedPoints / confirmedWeight) * 1000) / 10 : null;
  const evaluationCoverage =
    totalWeight > 0 ? Math.round((confirmedWeight / totalWeight) * 1000) / 10 : 0;

  return { normalizedScore, evaluationCoverage, confirmedWeight, earnedPoints, totalWeight };
}

/**
 * 商品の5AXISぶんのcriteriaを統合し、商品全体の評価充足率を算出する。
 * 各AXISのconfirmedWeight・totalWeightを単純合算するため、
 * ペルソナの重み付けとは独立した「情報の網羅度」を表す指標になる。
 */
export function calculateProductEvaluationCoverage(productScores: ProductAxisScores): number {
  const results = productScores.scores.map((entry) => deriveAxisScoreFromCriteria(entry.criteria));
  const totalWeight = results.reduce((sum, r) => sum + r.totalWeight, 0);
  const confirmedWeight = results.reduce((sum, r) => sum + r.confirmedWeight, 0);

  return totalWeight > 0 ? Math.round((confirmedWeight / totalWeight) * 1000) / 10 : 0;
}

/**
 * ============================================================
 * scoreDisplayStatus — 「計算されたスコア」と「どう表示してよいか」の分離レイヤー
 * ============================================================
 * normalizedScore・evaluationCoverageの計算処理（上記のderiveAxisScoreFromCriteria）は
 * 一切変更しない。ここに定義する関数群は、その計算結果を
 * ユーザー画面にそのまま出してよいか／参考値扱いにすべきか／
 * 出すべきでないか、を判定する表示専用の純粋関数群。
 */

/** confirmed と判定するための evaluationCoverage の下限（%） */
const CONFIRMED_COVERAGE_THRESHOLD = 80;
/** provisional と判定するための evaluationCoverage の下限（%）。これ未満は insufficient */
const PROVISIONAL_COVERAGE_THRESHOLD = 60;

/**
 * criteria配列と、そのAXISに設定されたcritical criterion id一覧から、
 * critical criterionがすべてverifiedかどうかを判定する。
 * criticalCriteriaが未設定（undefined）または空配列の場合は「制約なし」としてtrueを返す
 * （＝そのAXISにcritical criterionが設定されていないことを意味する）。
 */
export function areCriticalCriteriaVerified(
  criteria: AxisScoreCriterion[],
  criticalCriteria: string[] | undefined
): boolean {
  if (!criticalCriteria || criticalCriteria.length === 0) return true;
  return criticalCriteria.every((criterionId) =>
    criteria.some((c) => c.id === criterionId && c.status === "verified")
  );
}

/**
 * evaluationCoverage（0-100）とcritical criterionの充足状況から scoreDisplayStatus を判定する。
 *
 * - confirmed: evaluationCoverage >= 80 かつ critical criterionがすべてverified
 * - provisional: evaluationCoverage >= 60（confirmed条件を満たさない場合）
 * - insufficient: evaluationCoverage < 60
 */
export function resolveScoreDisplayStatus(
  evaluationCoverage: number,
  criticalCriteriaVerified: boolean
): ScoreDisplayStatus {
  if (evaluationCoverage >= CONFIRMED_COVERAGE_THRESHOLD && criticalCriteriaVerified) {
    return "confirmed";
  }
  if (evaluationCoverage >= PROVISIONAL_COVERAGE_THRESHOLD) {
    return "provisional";
  }
  return "insufficient";
}

export interface AxisCriteriaDisplayResult extends AxisCriteriaScoreResult {
  scoreDisplayStatus: ScoreDisplayStatus;
  criticalCriteriaVerified: boolean;
}

/**
 * deriveAxisScoreFromCriteriaの計算結果に、scoreDisplayStatusを合成した拡張版。
 * normalizedScore・evaluationCoverage自体はderiveAxisScoreFromCriteriaのまま変更しない。
 *
 * @param criteria このAXISの商品側criteria配列（AxisScoreEntry.criteria）
 * @param criticalCriteria このAXISに設定されたcritical criterion id一覧（AxisDefinition.criticalCriteria）。
 *   未設定のAXISは undefined を渡す。
 */
export function deriveAxisDisplayStatus(
  criteria: AxisScoreCriterion[],
  criticalCriteria: string[] | undefined
): AxisCriteriaDisplayResult {
  const base = deriveAxisScoreFromCriteria(criteria);
  const criticalCriteriaVerified = areCriticalCriteriaVerified(criteria, criticalCriteria);
  const scoreDisplayStatus = resolveScoreDisplayStatus(base.evaluationCoverage, criticalCriteriaVerified);

  return { ...base, scoreDisplayStatus, criticalCriteriaVerified };
}

/**
 * ============================================================
 * calculateDisplayAwareAxisScore — scoreDisplayStatusを反映した総合AXIS SCORE™（並行実装）
 * ============================================================
 * 既存の calculateAxisScore は一切変更しない。まったく別の新しい純粋関数として追加する。
 * まだ既存のランキング・UIのどこからも呼ばれていない。
 *
 * v1.0方針：
 * - confirmedのAXIS：総合計算に含める
 * - provisionalのAXIS：総合計算に含める（含めたうえで、総合スコア自体をprovisional寄りに倒す一因にする）
 * - insufficientのAXIS：総合計算から除外する（0点扱いにはしない＝情報不足と低評価を混同しない）
 * - 除外した分のweightは、計算対象に残ったAXIS間だけで再正規化する。
 *   profile.weights（persona weight）自体は一切書き換えない。計算のたびに一時的に再正規化するだけ。
 * - productScores.scoresにそのaxisKeyのエントリ自体が存在しない（まだ採点されていない）場合も、
 *   evaluationCoverage=0のinsufficientとして扱う（未採点＝情報ゼロと同義のため）。
 */

/**
 * 総合スコアを非表示（insufficient）にせず、少なくとも参考表示するために許容する
 * 「計算対象から除外されたAXIS数」の上限。5AXIS構成を前提に、1AXISまでの除外は許容し
 * （5AXIS中4AXIS以上が計算対象なら参考表示可）、2AXIS以上除外された場合（5AXIS中3AXIS以下）は
 * 総合点そのものを非表示（insufficient）にする。AXIS構成数が変わった場合は要再検討。
 */
const MAX_EXCLUDED_AXES_FOR_DISPLAY = 1;
/** 総合スコアをconfirmedと判定するための overallEvaluationCoverage の下限（%）。AXIS単体のconfirmed閾値と揃える */
const OVERALL_CONFIRMED_COVERAGE_THRESHOLD = 80;
/**
 * 除外されたAXISの元persona weight合計比率（0-1）がこの値以上の場合、
 * 除外AXIS数が少なくても（MAX_EXCLUDED_AXES_FOR_DISPLAY以内でも）総合scoreDisplayStatusをinsufficientにする。
 * 「AXIS数は少なくても、ユーザーが重視した軸そのものが欠けている」場合に総合点を非表示にするための、
 * AXIS数ベースのルールを補完するpersona weightベースのルール。
 * 例：defaultプロファイル（各0.2）でquietnessのみ除外＝0.20 → このルールには抵触しない（provisional表示可）。
 *     「子どもが寝ている間に使いたい」（quietness=0.5）でquietnessのみ除外＝0.50 → このルールに抵触し、
 *     除外AXIS数が1つだけでも総合insufficientになる。
 */
const EXCLUDED_PERSONA_WEIGHT_INSUFFICIENT_THRESHOLD = 0.3;

export interface DisplayAwareAxisBreakdownItem {
  axisKey: AxisKey;
  /** 内部値として保持するnormalizedScore。該当AXISが未採点の場合はnull */
  normalizedScore: number | null;
  evaluationCoverage: number;
  scoreDisplayStatus: ScoreDisplayStatus;
  /** プロファイルに定義された本来のpersona weight（書き換えない） */
  personaWeight: number;
  /** 総合計算に含めたか（confirmed/provisionalはtrue、insufficient・未採点はfalse） */
  includedInTotal: boolean;
  /** 計算対象に残ったAXIS間で再正規化した後のweight。含めなかった場合は0 */
  effectiveWeight: number;
  /** このAXISが総合スコアに寄与した分（normalizedScore × effectiveWeight）。含めなかった場合は0 */
  contribution: number;
}

export interface DisplayAwareAxisScoreResult {
  productId: string;
  profileId: string;
  /** 総合スコア。計算対象AXISが1つもない場合のみnull。normalizedScoreと同じく内部値として常に保持し、削除しない */
  totalScore: number | null;
  overallScoreDisplayStatus: ScoreDisplayStatus;
  /** プロファイルに定義された（weight>0の）AXIS総数。5AXIS構成なら5 */
  totalAxisCount: number;
  /** 総合計算に含めたAXIS数 */
  includedAxisCount: number;
  /** 全AXIS（未採点・insufficient含む）をpersona weightで加重平均したevaluationCoverage。総合スコアの情報網羅度の目安 */
  overallEvaluationCoverage: number;
  /** insufficientとして除外されたAXISの元persona weight合計（絶対値。profile.weightsの単位のまま） */
  excludedPersonaWeight: number;
  /** excludedPersonaWeightをtotalPersonaWeightに対する比率（0-1）に正規化した値。0.3以上でinsufficientルールが働く */
  excludedPersonaWeightShare: number;
  breakdown: DisplayAwareAxisBreakdownItem[];
}

/**
 * 商品の軸別スコアを、scoreDisplayStatusを踏まえて合算する。
 * insufficientなAXISは計算対象から除外し、残ったAXIS間でpersona weightを再正規化する。
 *
 * @param productScores 商品のAXISスコア（criteria付き）
 * @param profile 軸ごとのpersona weight（書き換えない）
 * @param axisDefinitions critical criteriaを含むAXIS定義（axisDefinitions.json由来）
 */
export function calculateDisplayAwareAxisScore(
  productScores: ProductAxisScores,
  profile: AxisScoreProfile,
  axisDefinitions: AxisDefinition[]
): DisplayAwareAxisScoreResult {
  const axisEntries = (Object.entries(profile.weights) as [AxisKey, number | undefined][]).filter(
    (entry): entry is [AxisKey, number] => (entry[1] ?? 0) > 0
  );

  const totalAxisCount = axisEntries.length;
  const totalPersonaWeight = axisEntries.reduce((sum, [, w]) => sum + w, 0) || 1;

  const perAxis = axisEntries.map(([axisKey, personaWeight]) => {
    const entry = productScores.scores.find((s) => s.axisKey === axisKey);
    const definition = axisDefinitions.find((d) => d.axisKey === axisKey);

    if (!entry) {
      return {
        axisKey,
        normalizedScore: null as number | null,
        evaluationCoverage: 0,
        scoreDisplayStatus: "insufficient" as ScoreDisplayStatus,
        personaWeight,
      };
    }

    const display = deriveAxisDisplayStatus(entry.criteria, definition?.criticalCriteria);
    return {
      axisKey,
      normalizedScore: display.normalizedScore,
      evaluationCoverage: display.evaluationCoverage,
      scoreDisplayStatus: display.scoreDisplayStatus,
      personaWeight,
    };
  });

  const includedAxes = perAxis.filter(
    (a): a is typeof a & { normalizedScore: number } =>
      a.scoreDisplayStatus !== "insufficient" && a.normalizedScore !== null
  );
  const includedPersonaWeightSum = includedAxes.reduce((sum, a) => sum + a.personaWeight, 0) || 1;

  const breakdown: DisplayAwareAxisBreakdownItem[] = perAxis.map((a) => {
    const includedInTotal = a.scoreDisplayStatus !== "insufficient" && a.normalizedScore !== null;
    const effectiveWeight = includedInTotal ? a.personaWeight / includedPersonaWeightSum : 0;
    const contribution = includedInTotal ? (a.normalizedScore as number) * effectiveWeight : 0;
    return {
      axisKey: a.axisKey,
      normalizedScore: a.normalizedScore,
      evaluationCoverage: a.evaluationCoverage,
      scoreDisplayStatus: a.scoreDisplayStatus,
      personaWeight: a.personaWeight,
      includedInTotal,
      effectiveWeight,
      contribution,
    };
  });

  const includedAxisCount = includedAxes.length;
  const excludedAxisCount = totalAxisCount - includedAxisCount;
  const excludedAxes = perAxis.filter((a) => !includedAxes.some((inc) => inc.axisKey === a.axisKey));
  const excludedPersonaWeight = excludedAxes.reduce((sum, a) => sum + a.personaWeight, 0);
  const excludedPersonaWeightShare =
    totalPersonaWeight > 0 ? Math.round((excludedPersonaWeight / totalPersonaWeight) * 1000) / 1000 : 0;

  const totalScoreRaw = breakdown.reduce((sum, item) => sum + item.contribution, 0);
  const totalScore = includedAxisCount > 0 ? Math.round(totalScoreRaw * 10) / 10 : null;

  const overallEvaluationCoverage =
    Math.round(
      (perAxis.reduce((sum, a) => sum + a.evaluationCoverage * a.personaWeight, 0) / totalPersonaWeight) * 10
    ) / 10;

  let overallScoreDisplayStatus: ScoreDisplayStatus;
  if (
    includedAxisCount === 0 ||
    excludedAxisCount > MAX_EXCLUDED_AXES_FOR_DISPLAY ||
    excludedPersonaWeightShare >= EXCLUDED_PERSONA_WEIGHT_INSUFFICIENT_THRESHOLD
  ) {
    overallScoreDisplayStatus = "insufficient";
  } else {
    const allIncludedConfirmed = includedAxes.every((a) => a.scoreDisplayStatus === "confirmed");
    if (
      excludedAxisCount === 0 &&
      allIncludedConfirmed &&
      overallEvaluationCoverage >= OVERALL_CONFIRMED_COVERAGE_THRESHOLD
    ) {
      overallScoreDisplayStatus = "confirmed";
    } else {
      overallScoreDisplayStatus = "provisional";
    }
  }

  return {
    productId: productScores.productId,
    profileId: profile.id,
    totalScore,
    overallScoreDisplayStatus,
    totalAxisCount,
    includedAxisCount,
    overallEvaluationCoverage,
    excludedPersonaWeight,
    excludedPersonaWeightShare,
    breakdown,
  };
}
