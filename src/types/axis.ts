import type { SourceType } from "@/types/product";

export type AxisKey =
  | "cleaning_power"
  | "quietness"
  | "maintainability"
  | "space_fit"
  | "price_value";

export type ScoreDirection = "higher_is_better" | "lower_is_better";

/**
 * ルーブリックの5段階のうちの1段階。
 * pointsは0〜weightの固定の獲得点（連続値ではなく、5段階の固定点のみを使う）。
 * 同じtierに該当する限り、微妙な差でpointsを変えることはしない。
 */
export interface ScoringTier {
  tier: "full" | "high" | "standard" | "low" | "zero";
  /** この段階に該当した場合の獲得点。0〜weightの範囲の絶対点数（0〜100の評価値ではない） */
  points: number;
  /** この段階に該当する具体的な条件 */
  condition: string;
}

/**
 * 1採点項目の具体的な採点ルーブリック。
 * 「なぜこの獲得点になったか」を後から人間が再現・検証できるようにするための定義。
 */
export interface ScoringGuide {
  /** 採点の考え方・何を根拠にするかの要約 */
  method: string;
  /** 満点／高評価／標準／低評価／0点の5段階（固定点） */
  tiers: ScoringTier[];
  /** unpublished（採点・評価充足率の算出対象外）となる条件 */
  unpublishedCondition: string;
  /** 数値閾値使用時の注意点（メーカー間の測定条件の違い等） */
  caveat?: string;
}

/**
 * AXIS SCORE™ 公式採点基準（ルーブリック）内の1採点項目の定義。
 * 1つのAXISに属するcriteriaのweight合計は100になるように定義する。
 */
export interface ScoringCriterionDefinition {
  id: string;
  label: string;
  weight: number;
  /** 採点方針・注意点（例：Pa値のみで決定しない、referencePriceを基準にする等） */
  description?: string;
  /** この項目の具体的な採点ルーブリック（満点〜0点の条件とunpublished条件） */
  scoringGuide: ScoringGuide;
}

export interface AxisDefinition {
  id: string;
  axisKey: AxisKey;
  category: string;
  label: string;
  description: string;
  scoreDirection: ScoreDirection;
  dataSourceFields: string[];
  /** AXIS SCORE™ 公式採点基準：このAXISを構成する採点項目（weight合計100） */
  criteria: ScoringCriterionDefinition[];
  /** この採点基準のバージョン（例: "1.0"） */
  rubricVersion: string;
  /**
   * このAXISのscoreDisplayStatusを "confirmed" にするために、
   * verifiedであることを必須とする criterion id（ScoringCriterionDefinition.id）の一覧。
   * 未設定（undefined）または空配列の場合、critical criterionなし＝evaluationCoverageの
   * 閾値のみでscoreDisplayStatusを判定する。
   * 例：quietnessでは body_noise の比重が大きく、それが未確認のまま
   * evaluationCoverageだけで高評価表示になることを防ぐために設定する。
   * 将来、他AXISに追加する場合はここに criterion id を足すだけで拡張できる。
   */
  criticalCriteria?: string[];
}

/**
 * AXISスコアをユーザー画面にどこまで確信を持って表示してよいかを表す表示ステータス。
 * normalizedScore・evaluationCoverageの「計算」とは独立した、表示専用のレイヤー。
 *
 * - confirmed: evaluationCoverageが十分高く、critical criterion（設定されていれば）も
 *   すべてverified。スコアをそのまま表示してよい。
 * - provisional: 一定の評価は行えているが、confirmedの基準には届かない。
 *   参考値であることを明示したうえで表示する。
 * - insufficient: 評価充足率が低く、normalizedScoreを主表示すべきではない状態。
 *   「評価情報不足」等の表示に置き換える。
 */
export type ScoreDisplayStatus = "confirmed" | "provisional" | "insufficient";

export type ScorerType =
  | "編集部評価"
  | "カタログ値換算"
  | "実測"
  | "ユーザーレビュー集計";

/**
 * 採点項目ごとの確認状況。
 * verified: 一次情報つきで人間が確認済み。スコア・評価充足率の算出対象。
 * unpublished: メーカーが公表していない。0点扱いにせず算出対象から除外する。
 * pending-review: 値は入力されているが、まだ人間によるレビュー・確認が済んでいない。
 *   verifiedになるまでは unpublished と同様に算出対象から除外する。
 */
export type CriterionStatus = "verified" | "unpublished" | "pending-review";

/**
 * 軸スコアを構成する個別の評価項目（商品ごとの実際の評価エントリ）。
 * ScoringCriterionDefinition.id に対応させ、一次情報つきで積み上げる。
 */
export interface AxisScoreCriterion {
  /** ScoringCriterionDefinition.id と対応するid */
  id: string;
  /** 表示用ラベル（例: "吸引性能"） */
  label: string;
  /** この項目の配点（ルーブリックのweightを複製保持。自己完結性のため） */
  weight: number;
  /**
   * 獲得点。0〜100の評価値ではなく、0〜weightの範囲の絶対点数。
   * 例）weight=25の項目なら score は 0〜25 の範囲（0-100%の評価値ではない）。
   * ScoringGuide.tiers で定義された5段階の固定点のいずれかを取る（任意の中間値は使わない）。
   * status が verified の場合のみ deriveAxisScoreFromCriteria の計算に使う。未確認はnull。
   */
  score: number | null;
  status: CriterionStatus;
  /** 採点根拠の説明。必須。unpublishedの場合も「未公表のため対象外」等を明記する */
  rationale: string;
  /** 観測された生の値（例: "950Pa", "75℃温水洗浄"）。参考情報として保持。未確認はnull */
  value: number | string | boolean | null;
  /** この項目の一次情報URL */
  sourceUrl: string | null;
  sourceType: SourceType | null;
  verifiedAt: string | null;
}

export interface AxisScoreEntry {
  axisKey: AxisKey;
  normalizedScore: number;
  /**
   * このスコアをつけた根拠説明（内部監査用）。必須。
   * scoreDisplayStatus・critical criterion・evaluationCoverage等の内部用語を含んでよい採点記録であり、
   * 一般ユーザー向けの公開UIにはそのまま表示しない（publicRationaleを使う）。
   */
  rationale: string;
  /**
   * 一般ユーザー向けの短い説明（1〜3文程度）。rationaleと同じ採点根拠から逸脱しないが、
   * 内部用語（scoreDisplayStatus・criticalCriteria・normalizedScore・evaluationCoverage等）は使わない。
   * 未設定の場合、公開UIでは根拠欄自体を表示しない（rationaleをフォールバック表示することはしない）。
   */
  publicRationale?: string;
  scorerType: ScorerType;
  scoredAt: string;
  /**
   * このスコアの根拠となる個別評価項目（複数可・出典つき）。
   * 実在商品では、ここに一次情報つきの項目を積み上げたうえで
   * 人が normalizedScore と rationale を確定する運用とする。
   * 未公表データからAIが推測してスコアを埋める仕組みは設けない。
   */
  criteria: AxisScoreCriterion[];
}

export interface ProductAxisScores {
  productId: string;
  scores: AxisScoreEntry[];
}

export interface AxisScoreProfile {
  id: string;
  name: string;
  description: string;
  /** axisKeyごとの重み。将来ペルソナ別プロファイルを追加する際はここに新しいエントリを増やす。 */
  weights: Partial<Record<AxisKey, number>>;
}
