import Link from "next/link";
import { products } from "@/lib/data";

/**
 * ファーストビュー右側は「選ぶための比較例」にする。AXIS SCORE™のランキング・バッジは置かず、
 * メーカー公表値として確認できた本体の高さ（bodyHeightMm、5商品とも確認済み・null無し）だけを
 * 並べる。幅・奥行きは商品によって「メーカーがどちらの向きか明示していない」ケースがあり
 * （/articles/robot-vacuum-narrow-roomの実寸監査を参照）、高さは向きの解釈が不要なため単独で使う。
 * 「おすすめ順」に見えないよう、順位番号・スコアは一切表示しない（並び替えは高さの昇順のみ）。
 */
function getPlacementExample() {
  const real = products.filter((p) => p.dataType === "real" && p.bodyHeightMm !== null);
  return [...real].sort((a, b) => (a.bodyHeightMm as number) - (b.bodyHeightMm as number));
}

function PlacementExampleList({ productCount }: { productCount: number }) {
  const placementExample = getPlacementExample();
  return (
    <>
      <p className="mb-3 text-[11px] leading-relaxed text-canvas-inkSoft">
        メーカー公表値で確認できた本体の高さです。家具下に入るかどうかの目安になります（おすすめ順ではありません）。
      </p>
      <ul className="divide-y divide-canvas-line">
        {placementExample.map((product) => (
          <li key={product.id} className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
            <span className="truncate text-sm text-canvas-ink">{product.name}</span>
            <span className="shrink-0 text-sm font-bold tabular-nums text-canvas-ink">{product.bodyHeightMm}mm</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export function HomeHero() {
  const productCount = products.filter((p) => p.dataType === "real").length;

  return (
    <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
      <div>
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-canvas-primary">
          暮らしに合う家電を、納得して選ぶ。
        </p>
        <h1 className="mb-4 text-3xl font-bold leading-tight text-canvas-ink sm:text-4xl">
          あなたの暮らしに合う、
          <br />
          ロボット掃除機を。
        </h1>
        <p className="mb-8 max-w-md text-base leading-relaxed text-canvas-inkSoft">
          予算、置き場所、手入れの手間。買ってから困らないために、違いと確認できない点まで比較します。
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="#condition-picker-heading"
            className="rounded-lg bg-canvas-primary px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-colors duration-150 hover:bg-canvas-primaryHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas-primary"
          >
            条件から候補を見る
          </a>
          <Link
            href="/robot-vacuums"
            className="rounded-lg border border-canvas-line bg-canvas-card px-6 py-3.5 text-sm font-bold text-canvas-ink transition-colors duration-150 hover:border-canvas-primary hover:text-canvas-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas-primary"
          >
            掲載商品を比較する
          </Link>
        </div>
      </div>

      {/*
        スマホ（lg未満）は開閉式・初期状態は閉じる。閉じた状態でも「掲載◯商品のうちの比較例」であることが
        分かるよう、summary自体に件数・比較例の文言を残す（条件から候補を見るまでの距離を縮めるため）。
        PC（lg以上）は既存の常時表示の比較表をそのまま維持する。
      */}
      <details className="group rounded-2xl border border-canvas-line bg-canvas-card p-5 shadow-sm lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-canvas-primary">
              掲載{productCount}商品のうちの比較例
            </p>
            <p className="text-sm font-bold text-canvas-ink">本体の高さを比較する</p>
          </div>
          <span
            aria-hidden="true"
            className="shrink-0 text-xs font-bold text-canvas-primary transition-transform duration-150 group-open:rotate-180"
          >
            ▾
          </span>
        </summary>
        <div className="mt-3 border-t border-canvas-line pt-3">
          <PlacementExampleList productCount={productCount} />
        </div>
      </details>

      <div className="hidden rounded-2xl border border-canvas-line bg-canvas-card p-5 shadow-sm lg:block">
        <p className="mb-0.5 text-[11px] font-bold uppercase tracking-wide text-canvas-primary">
          掲載{productCount}商品のうちの比較例
        </p>
        <p className="mb-1 text-sm font-bold text-canvas-ink">置き場所で選ぶなら：本体の高さ</p>
        <PlacementExampleList productCount={productCount} />
      </div>
    </section>
  );
}
