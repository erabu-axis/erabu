export type AffiliateProvider = "amazon" | "rakuten" | "yahoo" | "official" | "other";

export interface AffiliateLink {
  id: string;
  provider: AffiliateProvider;
  /** "その他ASP" の場合など、リンクの見出しに使う表示名 */
  label: string;
  url: string;
}

/** この商品情報をどこから得たか（実機検証のレビューフロー観点） */
export type SourceType =
  | "実機購入"
  | "レンタル"
  | "メーカー提供"
  | "メーカー公式サイト"
  | "公開情報";

export type ReviewStatus = "未検証" | "実機検証済" | "情報のみ";

/** スペックデータそのものの確認がどこまで済んでいるか */
export type DataConfirmationStatus = "未確認" | "一部確認" | "確認済み";

/**
 * 商品画像の利用区分。
 * affiliate: ASP（Amazon・楽天・Yahoo!ショッピング等）が提供する画像。
 * manufacturer-authorized: メーカーから掲載許諾を得た画像。
 * owned: 自社で撮影・保有する画像。
 * 利用条件を確認できていない画像（Google画像検索の転載等）はいずれにも該当せず、登録しない。
 */
export type ImageSourceType = "affiliate" | "manufacturer-authorized" | "owned";

export interface NoiseLevel {
  /** 稼働モード名（例: "静音", "標準", "強"） */
  mode: string;
  decibel: number;
}

/** 架空のプレースホルダ商品か、実在商品かの区別 */
export type ProductDataType = "sample" | "real";

export interface Product {
  id: string;
  /** サンプル（架空プレースホルダ）か実データかの区別。UI上での明示にも使う */
  dataType: ProductDataType;
  /** サイト表示用の商品名（短縮可） */
  name: string;
  /** メーカー公表の正式商品名。未確認はnull */
  officialName: string | null;
  /** メーカー */
  brand: string;
  /** 型番。未確認はnull */
  modelNumber: string | null;
  category: string;

  /** 発売年。未確認はnull */
  releaseYear: number | null;

  /** 通常価格・参考価格（セールに左右されない基準価格。AXIS SCORE™の算出に使う） */
  referencePrice: number | null;
  /** 現在の実勢価格。セール等で変動する。表示のみに使い、スコアには使わない */
  currentPrice: number | null;
  /** currentPrice を確認した日付 */
  priceCheckedAt: string | null;

  /**
   * 商品画像URL。利用許諾（アフィリエイト提供・メーカー許諾・自社保有のいずれか）を
   * 確認できていない画像は登録しない。未設定はnull（ProductImageが自動的にフォールバック表示する）。
   */
  imageUrl: string | null;
  /** 画像の代替テキスト。imageUrlがある場合はnullにしない運用とする */
  imageAlt: string | null;
  imageSourceType: ImageSourceType | null;
  /** 画像の出典・許諾確認元URL（任意）。ASP商品ページやメーカー許諾のやり取り先等 */
  imageSourceUrl?: string | null;

  /** 本体寸法（mm） */
  bodyWidthMm: number | null;
  bodyDepthMm: number | null;
  bodyHeightMm: number | null;
  /** 充電・自動ゴミ収集ステーションの寸法（mm） */
  stationWidthMm: number | null;
  stationDepthMm: number | null;
  stationHeightMm: number | null;

  /** 公称吸引力（Pa）。メーカーがPa表記していない場合はnull */
  suctionPowerPa: number | null;
  /** 水拭き方式（自由記述。例: "振動モップ", "回転モップ", "なし"） */
  moppingType: string | null;
  autoEmptying: boolean | null;
  autoMopWashing: boolean | null;
  autoMopDrying: boolean | null;
  /** 毛絡み対策（自由記述） */
  tangleReduction: string | null;
  /** 障害物回避方式（自由記述） */
  obstacleAvoidance: string | null;
  /** マッピング方式（自由記述。例: "LiDAR", "vSLAM"） */
  mappingType: string | null;
  /** 乗り越え可能な段差の高さ（mm） */
  stepClimbingMm: number | null;
  /** 最大稼働時間（分） */
  maxRuntimeMinutes: number | null;
  /** 稼働音。モードごとに複数記録できる。未確認はnull */
  noiseLevels: NoiseLevel[] | null;

  /** メーカー公表の特徴・セールスポイント（客観的な仕様紹介。編集部評価のpros/consとは別物） */
  features: string[] | null;

  /** 編集部の評価。実在商品では実機レビュー後に記入する */
  pros: string[];
  cons: string[];
  bestFor: string[];

  affiliateLinks: AffiliateLink[];

  /** この商品情報の一次情報URL。原則メーカー公式ページ */
  sourceUrl: string | null;
  sourceType: SourceType;
  /** 情報を確認した日付 */
  verifiedAt: string;
  /** スペックデータの確認状態 */
  dataConfirmationStatus: DataConfirmationStatus;

  reviewStatus: ReviewStatus;
  notes?: string;
}
