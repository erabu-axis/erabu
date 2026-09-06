import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-line bg-brand-bgRaised">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <p className="font-heading text-lg font-bold text-brand-ink">
              えらぶ<span className="text-brand-accent">。</span>
            </p>
            <p className="mt-2 text-sm text-brand-inkSoft">くらべて、自分の軸でえらぶ。</p>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-brand-inkSoft">サイトについて</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/robot-vacuums" className="text-brand-inkSoft hover:text-brand-accent">
                  商品を比較
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-brand-inkSoft hover:text-brand-accent">
                  比較記事
                </Link>
              </li>
              <li>
                <Link href="/about-axis-score" className="text-brand-inkSoft hover:text-brand-accent">
                  AXIS SCORE™とは
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-brand-inkSoft">運営</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-brand-inkSoft hover:text-brand-accent">
                  えらぶ。について
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-brand-inkSoft hover:text-brand-accent">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/advertising-policy" className="text-brand-inkSoft hover:text-brand-accent">
                  広告・アフィリエイトポリシー
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-brand-line pt-6 text-xs text-brand-inkSoft">
          <p>掲載している商品情報・AXIS SCORE™は、メーカー公式情報などをもとに編集部が確認した時点のものです。</p>
          <p className="mt-2">© 2026 えらぶ。 AXIS SCORE™は「えらぶ。」独自の評価指標の呼称です。</p>
        </div>
      </div>
    </footer>
  );
}
