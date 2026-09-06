import type { RecommendedForItem } from "@/types/productEditorial";

/** 「こんな人におすすめ」。ProductHeroの短縮版とは異なり、根拠まで含めて表示する。 */
export function RecommendedFor({ items }: { items: RecommendedForItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="mb-3 text-lg font-bold">こんな人におすすめ</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.label} className="rounded-lg border border-brand-line bg-brand-card p-4">
            <p className="font-bold text-brand-ink">{item.label}</p>
            <p className="mt-1 text-sm text-brand-inkSoft">{item.reason}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
