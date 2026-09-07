import Link from "next/link";
import type { AxisDefinition } from "@/types/axis";
import type { AxisLeader } from "@/lib/data";

/**
 * 「他の候補と迷ったら」。単純な総合AXIS SCORE™順位ではなく、AXIS単体の
 * scoreDisplayStatusがconfirmedの商品だけを対象にした軸別リーダーを表示する
 * （getAxisLeadersで算出済み。ここでは表示のみを担当する）。
 */
/** themeは既定"brand"（既存の全呼び出し箇所＝他4商品・全記事と完全に同じ見た目）。"canvas"はデザイン試作専用。 */
export function CompareWithOthers({
  leaders,
  axisDefinitions,
  heading = "他の候補と迷ったら",
  labelSuffix = "なら",
  theme = "brand",
}: {
  leaders: AxisLeader[];
  axisDefinitions: AxisDefinition[];
  /** 見出しテキスト。商品詳細ページと記事ページで文脈が異なるため差し替え可能にしている。 */
  heading?: string;
  /** 「{AXIS名}{labelSuffix}」の形式で1件ずつ表示する。例："清掃性能を最優先するなら"。 */
  labelSuffix?: string;
  theme?: "brand" | "canvas";
}) {
  if (leaders.length === 0) return null;

  const cls =
    theme === "canvas"
      ? { headingCls: "text-canvas-ink", item: "border-canvas-line bg-canvas-card", text: "text-canvas-inkSoft", link: "text-canvas-primary" }
      : { headingCls: "", item: "border-brand-line bg-brand-card", text: "text-brand-inkSoft", link: "text-brand-accent" };

  return (
    <section className="mb-10">
      <h2 className={`mb-3 text-lg font-bold ${cls.headingCls}`}>{heading}</h2>
      <ul className="space-y-2">
        {leaders.map((leader) => {
          const def = axisDefinitions.find((d) => d.axisKey === leader.axisKey);
          return (
            <li key={leader.axisKey} className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 ${cls.item}`}>
              <span className={`text-sm ${cls.text}`}>
                {def?.label ?? leader.axisKey}
                {labelSuffix}
                <Link href={`/robot-vacuums/${leader.productId}`} className={`mx-1 font-bold underline ${cls.link}`}>
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
