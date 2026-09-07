/**
 * 「できることと残る手入れ」。数値・文言は/articles/robot-vacuum-low-maintenanceの
 * お手入れ自動化比較表と同じ確認済みソース（products.jsonのautoEmptying等のboolean値、
 * productAxisScores.jsonのmaintainability軸criteria）から転記したもので、新たな確認・推測は
 * 行っていない。「人が行う主な作業」は具体的な頻度が確認できないため、確認できない旨だけを書き、
 * 「作業不要」等の断定はしない（低メンテナンス記事での修正と同じルール）。
 */
const AUTOMATED_ITEMS = [
  { label: "自動ゴミ収集", detail: "最大3か月分" },
  { label: "モップ自動洗浄", detail: "75℃温水" },
  { label: "モップ自動乾燥", detail: "45℃温風" },
  { label: "ステーション自体の自己洗浄", detail: "内部に水を循環させる自己洗浄機構あり" },
];

export function RoombaMaintenanceSection() {
  return (
    <section aria-labelledby="maintenance-heading" className="mb-10 rounded-2xl border border-canvas-line bg-canvas-card p-5 sm:p-6">
      <h2 id="maintenance-heading" className="mb-4 text-lg font-bold text-canvas-ink">
        できることと残る手入れ
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-bold text-canvas-primary">自動化されていること（確認済み）</p>
          <ul className="space-y-2">
            {AUTOMATED_ITEMS.map((item) => (
              <li key={item.label} className="flex items-start gap-2 text-sm text-canvas-ink">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-canvas-primary" aria-hidden="true">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>
                  <span className="font-bold">{item.label}</span>
                  <span className="text-canvas-inkSoft">（{item.detail}）</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold text-canvas-inkSoft">残る手入れ・確認できていない点</p>
          <ul className="space-y-2 text-sm text-canvas-inkSoft">
            <li className="rounded-md border border-dashed border-canvas-line p-3">
              ブラシに絡まった毛について、「毎回切り取る必要がない」とは明記されていますが、除去の具体的な仕組みまでは確認できていません。
            </li>
            <li className="rounded-md border border-dashed border-canvas-line p-3">
              給水・消耗品交換など、具体的な作業頻度は確認できていません（「作業不要」という意味ではありません）。
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
