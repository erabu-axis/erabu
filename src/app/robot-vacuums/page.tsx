import type { Metadata } from "next";
import { axisDefinitions, getProductsWithScores } from "@/lib/data";
import { ComparisonTable } from "@/components/ComparisonTable";
import { buildPageMetadata } from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: "ロボット掃除機 比較表 | えらぶ。",
  description:
    "清掃性能・静音性・メンテナンス性・住宅適合性・価格対効果の5つのAXIS SCORE™で、ロボット掃除機を比較できる一覧表です。重視するポイントに応じてスコアを並び替えられます。",
  path: "/robot-vacuums",
});

export default function RobotVacuumsPage() {
  const items = getProductsWithScores();

  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-accent">
        商品データベース
      </p>
      <h1 className="mb-4 text-3xl font-bold">ロボット掃除機 比較表</h1>
      <p className="mb-8 max-w-2xl text-brand-inkSoft">
        清掃性能・静音性・メンテナンス性・住宅適合性・価格対効果の5軸で全商品を評価しています。現在のAXIS
        SCORE™は5軸の単純平均です（将来、生活シーン別の重み付けプロファイルに切り替えられるように設計しています）。
      </p>
      <ComparisonTable items={items} axisDefinitions={axisDefinitions} />
    </div>
  );
}
