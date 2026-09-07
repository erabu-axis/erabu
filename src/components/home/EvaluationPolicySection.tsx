import Link from "next/link";

/** ページ下部の短い評価方針。詳細はabout-axis-scoreへ委ね、ここでは要点だけを3つに絞る。 */
export function EvaluationPolicySection() {
  return (
    <section className="rounded-xl border border-canvas-line bg-canvas-card p-6" aria-labelledby="evaluation-policy-heading">
      <h2 id="evaluation-policy-heading" className="mb-3 text-lg font-bold text-canvas-ink">
        評価方針
      </h2>
      <ul className="space-y-2 text-sm text-canvas-inkSoft">
        <li className="flex gap-2">
          <span aria-hidden="true" className="text-canvas-primary">
            —
          </span>
          メーカー公式サイトなどの一次情報を中心に、確認できた事実のみで評価しています。
        </li>
        <li className="flex gap-2">
          <span aria-hidden="true" className="text-canvas-primary">
            —
          </span>
          現時点では編集部による実機検証ではなく、公表情報の確認にもとづく評価です。
        </li>
        <li className="flex gap-2">
          <span aria-hidden="true" className="text-canvas-primary">
            —
          </span>
          広告収益の有無とAXIS SCORE™・掲載順位は分離しています。
        </li>
      </ul>
      <Link
        href="/about-axis-score"
        className="mt-4 inline-block text-sm font-bold text-canvas-primary underline decoration-canvas-primary/40 underline-offset-2 hover:text-canvas-primaryHover"
      >
        AXIS SCORE™の評価方法をくわしく見る →
      </Link>
    </section>
  );
}
