/**
 * 商品詳細ページ向けの編集部コンテンツ（結論・推薦文等）。
 * products.json（スペック事実）・productAxisScores.json（採点根拠）とは役割を分離し、
 * 「編集部の文章判断」だけをここに集約する。source of truthは常にproducts.json /
 * productAxisScores.json（publicRationale含む）であり、ここでは新しい商品事実を作らない。
 */

export interface RecommendedForItem {
  /** 「こんな人におすすめ」の短いラベル（例："本体をとにかく小さくしたい人"） */
  label: string;
  /** そのラベルに至った根拠（1文程度、既存の確認済み事実のみ） */
  reason: string;
}

export interface ConsiderAlternativeItem {
  /** 「他の商品も比較したい人」の短いラベル */
  label: string;
  /** そのラベルに至った根拠（1文程度、既存の確認済み事実のみ） */
  reason: string;
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
