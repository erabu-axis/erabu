export interface Comparison {
  id: string;
  slug: string;
  title: string;
  /** 所属クラスター。例: "robot_vacuum" */
  cluster: string;
  /** axisScoreProfiles.json の id を参照 */
  personaProfileId: string;
  /** 比較対象となる products.json の id 配列 */
  productIds: string[];
  selectionCriteria: string;
  /** 内部リンク生成の元データ。関連する comparisons.json の slug 配列 */
  relatedSlugs: string[];
  status: "draft" | "published";
  updatedAt: string;
}
