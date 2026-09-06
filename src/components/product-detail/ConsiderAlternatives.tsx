import type { ConsiderAlternativeItem } from "@/types/productEditorial";

/**
 * 「他の商品も比較したい人」。「おすすめしない」という断定は避け、
 * 特定の条件を重視する場合は他商品も見た方がよい、という柔らかい表現にする。
 */
export function ConsiderAlternatives({ items }: { items: ConsiderAlternativeItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="mb-3 text-lg font-bold">他の商品も比較したい人</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.label} className="rounded-lg border border-dashed border-brand-line p-4">
            <p className="font-bold text-brand-ink">{item.label}</p>
            <p className="mt-1 text-sm text-brand-inkSoft">{item.reason}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
