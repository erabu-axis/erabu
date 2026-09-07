import Link from "next/link";
import type { ReactNode } from "react";

export interface BreadcrumbItem {
  /** 通常はstring。画面幅で表示テキストを出し分けたい場合のみReactNodeを渡せる（既存呼び出し箇所は全てstringのまま動作する）。 */
  label: ReactNode;
  /** 現在のページの場合はhrefを省略する（リンクにせず、太字テキストで表示する） */
  href?: string;
}

/** ページ上部に置く簡易パンくずリスト。ホームは呼び出し側で明示的に含める。 */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="パンくずリスト" className="mb-4 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-brand-inkSoft">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1.5">
          {item.href ? (
            <Link href={item.href} className="hover:text-brand-accent">
              {item.label}
            </Link>
          ) : (
            <span className="font-bold text-brand-ink" aria-current="page">
              {item.label}
            </span>
          )}
          {index < items.length - 1 && <span aria-hidden="true">›</span>}
        </span>
      ))}
    </nav>
  );
}
