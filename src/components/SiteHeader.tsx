import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-brand-line bg-brand-bgRaised">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-4">
        <Link href="/" className="font-heading text-xl font-bold tracking-tight text-brand-ink">
          えらぶ<span className="text-brand-accent">。</span>
        </Link>
        <nav className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-brand-inkSoft">
          <Link href="/robot-vacuums" className="hover:text-brand-accent">
            ロボット掃除機
          </Link>
          <Link href="/articles/robot-vacuum-how-to-choose" className="hover:text-brand-accent">
            選び方
          </Link>
          <Link href="/about-axis-score" className="hover:text-brand-accent">
            評価方法
          </Link>
          <Link href="/about" className="hover:text-brand-accent">
            運営情報
          </Link>
        </nav>
      </div>
    </header>
  );
}
