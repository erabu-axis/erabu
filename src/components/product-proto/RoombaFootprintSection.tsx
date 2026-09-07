import type { Product } from "@/types/product";

/**
 * 「設置サイズ」。本体寸法・ドック外形寸法・設置余白を区別して表示する。
 * Roombaはメーカー公式ページ（store.irobot-jp.com）で幅・奥行き・高さが個別ラベルで
 * 明示されているため「幅×奥行×高さ」と断定してよい（2026-09-07の実寸データ監査で確認済み。
 * narrow-room記事のBODY_DIMENSION_META/STATION_DIMENSION_METAと同じ判定＝confirmed）。
 * 設置に必要な余白（前方・側方のクリアランス）はメーカー公式ページに確認できる記載がないため、
 * 断定せず「非公表」として扱う（捏造しない）。
 */
export function RoombaFootprintSection({ product }: { product: Product }) {
  const { bodyWidthMm, bodyDepthMm, bodyHeightMm, stationWidthMm, stationDepthMm, stationHeightMm } = product;

  return (
    <section aria-labelledby="footprint-heading" className="mb-10 rounded-2xl border border-canvas-line bg-canvas-card p-5 sm:p-6">
      <h2 id="footprint-heading" className="mb-1 text-lg font-bold text-canvas-ink">
        設置サイズ
      </h2>
      <p className="mb-4 text-xs text-canvas-inkSoft">メーカー公式ページで幅・奥行き・高さが個別に確認できた数値です。</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-canvas-line p-4">
          <p className="mb-1 text-xs font-bold text-canvas-inkSoft">本体寸法（幅×奥行×高さ）</p>
          <p className="text-base font-bold tabular-nums text-canvas-ink">
            {bodyWidthMm}mm × {bodyDepthMm}mm × {bodyHeightMm}mm
          </p>
        </div>
        <div className="rounded-lg border border-canvas-line p-4">
          <p className="mb-1 text-xs font-bold text-canvas-inkSoft">ドック外形寸法（幅×奥行×高さ）</p>
          <p className="text-base font-bold tabular-nums text-canvas-ink">
            {stationWidthMm}mm × {stationDepthMm}mm × {stationHeightMm}mm
          </p>
        </div>
        <div className="rounded-lg border border-dashed border-canvas-line p-4">
          <p className="mb-1 text-xs font-bold text-canvas-inkSoft">メーカー指定の設置余白</p>
          <p className="text-base font-bold text-canvas-inkSoft">非公表</p>
          <p className="mt-1 text-[11px] text-canvas-inkSoft">
            メーカー公式ページに具体的な余白の数値が確認できていないため、推測では補っていません。
          </p>
        </div>
      </div>
    </section>
  );
}
