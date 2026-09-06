/**
 * ranking: 既存3記事のような、特定personaでAXIS SCORE™を再計算してランキング表示する記事。
 * guide: 商品をランキングせず、5AXISの考え方や判断軸そのものを説明するハブ・解説記事。
 * ranking記事の挙動（personaProfileId・productIdsの必須性等）は従来どおりで変更していない。
 */
export type ArticleType = "ranking" | "guide";

export interface Comparison {
  id: string;
  slug: string;
  title: string;
  /** 所属クラスター。例: "robot_vacuum" */
  cluster: string;
  articleType: ArticleType;
  /** axisScoreProfiles.json の id を参照。ranking記事のみ使用（guide記事はundefined） */
  personaProfileId?: string;
  /** 比較対象となる products.json の id 配列。ranking記事のみ使用（guide記事はundefined） */
  productIds?: string[];
  /** 比較対象の選定基準。ranking記事のみ使用（guide記事はundefined） */
  selectionCriteria?: string;
  /** 内部リンク生成の元データ。関連する comparisons.json の slug 配列 */
  relatedSlugs: string[];
  status: "draft" | "published";
  updatedAt: string;
}
