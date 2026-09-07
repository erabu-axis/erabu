/**
 * 商品詳細ページ向けの編集部コンテンツ（結論・推薦文等）。
 * products.json（スペック事実）・productAxisScores.json（採点根拠）とは役割を分離し、
 * 「編集部の文章判断」だけをここに集約する。source of truthは常にproducts.json /
 * productAxisScores.json（publicRationale含む）であり、ここでは新しい商品事実を作らない。
 */

import type { AxisKey } from "@/types/axis";

export interface RecommendedForItem {
  /** 「こんな人におすすめ」の短いラベル（例："本体をとにかく小さくしたい人"） */
  label: string;
  /** そのラベルに至った根拠（1文程度、既存の確認済み事実のみ） */
  reason: string;
  /**
   * このラベル・reasonが主にどのAXISについての言及か（任意）。
   * 記事側（ArticleProductEvaluationCards）が、記事のテーマAXISに対応する理由だけを
   * 優先表示するために使う。文章のキーワード検索では判定せず、内容から明確に対応が
   * わかるものにだけ付与する。複数AXISにまたがる場合や、AXISに紐づかない場合は未設定のままにする。
   */
  axisKey?: AxisKey;
}

export interface ConsiderAlternativeItem {
  /** 「他の商品も比較したい人」の短いラベル */
  label: string;
  /** そのラベルに至った根拠（1文程度、既存の確認済み事実のみ） */
  reason: string;
  /** RecommendedForItem.axisKeyと同じ考え方。 */
  axisKey?: AxisKey;
}

export interface ProductEditorial {
  productId: string;
  /**
   * ファーストビュー用の一言結論（1文）。provisional/insufficient等の内部ステータスは
   * 混ぜず、確認できている事実の範囲で商品の選択軸を端的に伝える。
   */
  oneLineConclusion: string;
  /** 「えらぶ。の結論」セクション用の1〜3段落 */
  verdictParagraphs: string[];
  recommendedFor: RecommendedForItem[];
  considerAlternativesIf: ConsiderAlternativeItem[];
  updatedAt: string;
}
