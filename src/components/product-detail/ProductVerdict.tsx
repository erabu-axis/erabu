/** 「えらぶ。の結論」セクション。編集部が確認済み事実だけをもとに、誰に向くかを説明する。 */
export function ProductVerdict({ paragraphs }: { paragraphs: string[] }) {
  if (paragraphs.length === 0) return null;

  return (
    <section className="mb-10 rounded-lg border border-brand-line bg-brand-card p-5">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-brand-accent2">えらぶ。の結論</h2>
      <div className="space-y-3 text-sm text-brand-inkSoft">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}
