import Link from "next/link";
import type { AxisDefinition } from "@/types/axis";
import type { AxisLeader } from "@/lib/data";

/**
 * 「他の候補と迷ったら」。単純な総合AXIS SCORE™順位ではなく、AXIS単体の
 * scoreDisplayStatusがconfirmedの商品だけを対象にした軸別リーダーを表示する
 * （getAxisLeadersで算出済み。ここでは表示のみを担当する）。
 */
export function CompareWithOthers({
  leaders,
  axisDefinitions,
  heading = "他の候補と迷ったら",
  labelSuffix = "なら",
}: {
  leaders: AxisLeader[];
  axisDefinitions: AxisDefinition[];
  /** 見出しテキスト。商品詳細ページと記事ページで文脈が異なるため差し替え可能にしている。 */
  heading?: string;
  /** 「{AXIS名}{labelSuffix}」の形式で1件ずつ表示する。例："清掃性能を最優先するなら"。 */
  labelSuffix?: string;
}) {
  if (leaders.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="mb-3 text-lg font-bold">{heading}</h2>
      <ul className="space-y-2">
        {leaders.map((leader) => {
          const def = axisDefinitions.find((d) => d.axisKey === leader.axisKey);
          return (
            <li key={leader.axisKey} className="flex items-center justify-between gap-3 rounded-lg border border-brand-line bg-brand-card px-4 py-3">
              <span className="text-sm text-brand-inkSoft">
                {def?.label ?? leader.axisKey}
                {labelSuffix}
                <Link href={`/robot-vacuums/${leader.productId}`} className="mx-1 font-bold text-brand-accent underline">
                  {leader.productName}
                </Link>
                （{leader.normalizedScore}）
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
