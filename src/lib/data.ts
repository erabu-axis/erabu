import productsData from "@/data/products.json";
import axisDefinitionsData from "@/data/axisDefinitions.json";
import productAxisScoresData from "@/data/productAxisScores.json";
import axisScoreProfilesData from "@/data/axisScoreProfiles.json";
import comparisonsData from "@/data/comparisons.json";
import productEditorialData from "@/data/productEditorial.json";
import type { Product } from "@/types/product";
import type { AxisDefinition, AxisKey, AxisScoreProfile, ProductAxisScores, ScoreDisplayStatus } from "@/types/axis";
import type { Comparison } from "@/types/comparison";
import type { ProductEditorial } from "@/types/productEditorial";
import {
  calculateAxisScore,
  calculateDisplayAwareAxisScore,
  deriveAxisDisplayStatus,
  type AxisScoreResult,
  type DisplayAwareAxisScoreResult,
} from "@/lib/axisScore";

export const products = productsData as Product[];
export const axisDefinitions = axisDefinitionsData as AxisDefinition[];
export const productAxisScores = productAxisScoresData as ProductAxisScores[];
export const axisScoreProfiles = axisScoreProfilesData as AxisScoreProfile[];
export const comparisons = comparisonsData as Comparison[];
export const productEditorials = productEditorialData as ProductEditorial[];

export const DEFAULT_PROFILE_ID = "default";

export function getProfile(profileId: string = DEFAULT_PROFILE_ID): AxisScoreProfile {
  const profile = axisScoreProfiles.find((p) => p.id === profileId);
  if (!profile) {
    throw new Error(`AxisScoreProfile not found: ${profileId}`);
  }
  return profile;
}

export function getProduct(productId: string): Product | undefined {
  return products.find((p) => p.id === productId);
}

export function getProductAxisScores(productId: string): ProductAxisScores | undefined {
  return productAxisScores.find((s) => s.productId === productId);
}

export interface ProductWithScore {
  product: Product;
  /**
   * sample商品向けの旧経路。AXIS SCORE™がまだ採点されていない商品、またはdataType==="real"の商品では null。
   * dataType==="real"の商品はcriteria/scoreDisplayStatusを持たないcalculateAxisScoreを使わず、
   * displayAwareResult（下記）を使う。既存のsample商品のUI・デモを壊さないための分離。
   */
  axisScoreResult: AxisScoreResult | null;
  /**
   * dataType==="real"の商品向けの新経路。scoreDisplayStatus（confirmed/provisional/insufficient）を
   * 反映した総合スコア。採点データ自体が存在しない商品（「採点準備中」）では null。
   */
  displayAwareResult: DisplayAwareAxisScoreResult | null;
}

function buildProductWithScore(
  product: Product,
  scores: ProductAxisScores | undefined,
  profile: AxisScoreProfile
): ProductWithScore {
  if (!scores) {
    return { product, axisScoreResult: null, displayAwareResult: null };
  }
  if (product.dataType === "real") {
    return {
      product,
      axisScoreResult: null,
      displayAwareResult: calculateDisplayAwareAxisScore(scores, profile, axisDefinitions),
    };
  }
  return { product, axisScoreResult: calculateAxisScore(scores, profile), displayAwareResult: null };
}

export function getProductWithScore(
  productId: string,
  profileId: string = DEFAULT_PROFILE_ID
): ProductWithScore | undefined {
  const product = getProduct(productId);
  if (!product) return undefined;
  const scores = getProductAxisScores(productId);
  const profile = getProfile(profileId);
  return buildProductWithScore(product, scores, profile);
}

/**
 * 通常のユーザー向け一覧（トップページ・比較表・ランキング）で使う商品リスト。
 * dataType==="sample"（開発・回帰テスト用のプレースホルダ）は公開UIの対象外とし、
 * dataType==="real"の商品のみを返す。sampleデータ自体はproducts.json/productAxisScores.jsonに
 * 残したままなので、products（無フィルタのraw export）から個別に参照すれば開発時にも利用できる。
 */
export function getProductsWithScores(profileId: string = DEFAULT_PROFILE_ID): ProductWithScore[] {
  const profile = getProfile(profileId);
  return products
    .filter((product) => product.dataType === "real")
    .map((product) => buildProductWithScore(product, getProductAxisScores(product.id), profile));
}

export interface OverallScoreInfo {
  /** 内部値としてのnormalizedScore（保持のみ。insufficientの場合は表示に使わない） */
  score: number | null;
  /** null＝採点データ自体がない（採点準備中）。それ以外はscoreDisplayStatusをそのまま返す */
  status: ScoreDisplayStatus | null;
}

/**
 * ProductWithScoreから、表示用の総合スコアとステータスを一元的に取り出す。
 * sample商品（axisScoreResult経由）はconfirmed相当として扱い、既存の見た目を変えない。
 * real商品（displayAwareResult経由）はscoreDisplayStatusをそのまま反映する。
 */
export function getOverallScoreInfo(item: ProductWithScore): OverallScoreInfo {
  if (item.axisScoreResult) {
    return { score: item.axisScoreResult.totalScore, status: "confirmed" };
  }
  if (item.displayAwareResult) {
    return { score: item.displayAwareResult.totalScore, status: item.displayAwareResult.overallScoreDisplayStatus };
  }
  return { score: null, status: null };
}

/**
 * ランキング・並び替え専用の比較可能スコア。insufficientな商品は0点扱いにはせず、
 * 単純に並び替えの最下位（-Infinity）に置く。この値を画面に表示してはならない。
 */
export function getSortableScore(item: ProductWithScore): number {
  if (item.axisScoreResult) return item.axisScoreResult.totalScore;
  if (item.displayAwareResult) {
    if (item.displayAwareResult.overallScoreDisplayStatus === "insufficient") return -Infinity;
    return item.displayAwareResult.totalScore ?? -Infinity;
  }
  return -Infinity;
}

export function getComparison(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug);
}

/** /articles一覧・トップページの比較記事セクション向け。status==="published"の記事のみを、comparisons.jsonの掲載順で返す。 */
export function getPublishedComparisons(): Comparison[] {
  return comparisons.filter((c) => c.status === "published");
}

export function getProductEditorial(productId: string): ProductEditorial | undefined {
  return productEditorials.find((e) => e.productId === productId);
}

export interface AxisLeader {
  axisKey: AxisKey;
  productId: string;
  productName: string;
  normalizedScore: number;
}

/**
 * 商品詳細ページの「他の候補と迷ったら」向け。指定AXISそれぞれについて、
 * excludeProductId以外のreal商品の中から、そのAXIS単体のscoreDisplayStatusが
 * confirmedのものだけを対象にnormalizedScoreが最も高い商品を選ぶ。
 * 総合AXIS SCORE™のconfirmed/provisionalは問わない（AXIS単体の確信度のみで判断する）。
 * insufficientなAXISは候補にしない。該当AXISで候補が1つもない場合はそのAXISを結果に含めない。
 */
export function getAxisLeaders(excludeProductId: string, axisKeys: AxisKey[]): AxisLeader[] {
  const candidates = products.filter((p) => p.dataType === "real" && p.id !== excludeProductId);
  const leaders: AxisLeader[] = [];

  for (const axisKey of axisKeys) {
    let best: AxisLeader | null = null;
    for (const product of candidates) {
      const scores = getProductAxisScores(product.id);
      const entry = scores?.scores.find((s) => s.axisKey === axisKey);
      if (!entry) continue;
      const def = axisDefinitions.find((d) => d.axisKey === axisKey);
      const display = deriveAxisDisplayStatus(entry.criteria, def?.criticalCriteria);
      if (display.scoreDisplayStatus !== "confirmed" || display.normalizedScore === null) continue;
      if (!best || display.normalizedScore > best.normalizedScore) {
        best = { axisKey, productId: product.id, productName: product.name, normalizedScore: display.normalizedScore };
      }
    }
    if (best) leaders.push(best);
  }

  return leaders;
}
