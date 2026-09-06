import type { Metadata } from "next";
import Link from "next/link";
import { axisDefinitions, axisScoreProfiles, DEFAULT_PROFILE_ID } from "@/lib/data";
import { formatWeightPct } from "@/lib/article";
import { AxisScoreBadge } from "@/components/AxisScoreBadge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildPageMetadata } from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: "AXIS SCORE™とは｜評価方法について | えらぶ。",
  description:
    "「えらぶ。」独自の指標AXIS SCORE™の考え方と評価方法を解説します。5つの比較軸、重視するタイプ別の重み付け、confirmed／参考／評価情報不足の意味など、スコアを正しく理解するための情報をまとめています。",
  path: "/about-axis-score",
});

const defaultProfile = axisScoreProfiles.find((p) => p.id === DEFAULT_PROFILE_ID);

// quietness（body_noise）のように、確認できないとconfirmedにならない「特に重要な項目」を持つAXISを実データから拾う。
// 該当AXISが将来増減しても、この文章は自動的に正しい状態を保つ。
const axisWithCriticalCriteria = axisDefinitions.find(
  (d) => d.criticalCriteria && d.criticalCriteria.length > 0
);

// axisDefinitions.jsonのdescriptionは公開に適した短い説明が中心だが、price_valueのみ
// 内部rubricの用語（criterion ID・tier名）を含む監査寄りの文章のため、このページでは表示しない。
// 詳細は後段の「価格対効果（price_value）の特別なルール」セクションで一般向けに説明する。
const AXIS_CARD_DESCRIPTION_OVERRIDES: Partial<Record<string, string>> = {
  price_value: "支払う価格に対して、清掃性能・自動化機能・住宅適合性の面でどれだけ価値ある内容を得られるかを評価する（詳しくは後述）。",
};

export default function AboutAxisScorePage() {
  return (
    <article className="max-w-3xl">
      <Breadcrumbs items={[{ label: "ホーム", href: "/" }, { label: "AXIS SCORE™とは" }]} />
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-accent">AXIS SCORE™</p>
      <h1 className="mb-4 text-3xl font-bold">AXIS SCORE™とは</h1>
      <p className="mb-10 max-w-2xl text-brand-inkSoft">
        「えらぶ。」は、感想やランキングの順位ではなく、5つの比較軸（AXIS）のスコアで「結局どっちを選べばいいか」に結論を出す比較サイトです。このページでは、AXIS SCORE™が何をどう評価しているか、そしてスコアをどこまで信頼してよいかを説明します。
      </p>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">なぜ単純なおすすめランキングではないのか</h2>
        <p className="text-brand-inkSoft">
          「とにかくこれがおすすめ」という単一のランキングは分かりやすい一方で、人によって重視するポイントが違うという事実を覆い隠してしまいます。狭い家に住んでいる人と、とにかく清掃力を重視したい人では、同じ商品でも評価が変わって当然です。AXIS
          SCORE™は、清掃性能・静音性・メンテナンス性・住宅適合性・価格対効果という5つの軸に分けて商品を評価し、さらに「何を重視するか」に応じて軸の重み付けを変えられるようにすることで、この違いをそのまま比較に反映します。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">5つのAXIS（比較軸）</h2>
        <p className="mb-4 text-brand-inkSoft">
          全商品を同じ5つの軸で評価し、軸ごとの評価項目（criteria）とその根拠をすべて公開しています。各軸のcriteriaの配点（weight）の合計は100になるよう設計されています。
        </p>
        <div className="space-y-3">
          {axisDefinitions.map((def) => (
            <div key={def.axisKey} className="rounded-lg border border-brand-line bg-brand-card p-4">
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-bold text-brand-ink">{def.label}</span>
                <span className="text-xs text-brand-inkSoft">rubric v{def.rubricVersion}</span>
              </div>
              <p className="mb-2 text-sm text-brand-inkSoft">
                {AXIS_CARD_DESCRIPTION_OVERRIDES[def.axisKey] ?? def.description}
              </p>
              <p className="text-xs text-brand-inkSoft">
                評価項目：{def.criteria.map((c) => c.label).join("・")}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">各AXISは、複数の評価項目から採点する</h2>
        <p className="text-brand-inkSoft">
          たとえば清掃性能は、吸引力の数値だけで決めていません。水拭き性能・壁際や隅への対応・カーペット対応・ブラシの毛絡み対策など、複数の評価項目（criteria）をメーカー公式情報など一次情報にもとづいて個別に確認し、その積み上げとしてAXISごとのスコアを算出しています。吸引力の絶対値（Pa値）を公表していないメーカーもありますが、それだけを理由に低い評価にすることはありません。技術・機構面など、確認できる範囲の情報から評価します。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">重視するタイプ（persona）によって重みが変わる</h2>
        <p className="mb-4 text-brand-inkSoft">
          何を重視するかは人によって違うため、AXIS SCORE™は「重視するタイプ」ごとに軸の重み付けを変えて総合スコアを再計算できます。何も選ばない初期状態では、5つのAXISを均等（各
          {defaultProfile ? formatWeightPct(defaultProfile.weights.cleaning_power) : "20"}
          %）に評価する、バランス重視の重み付けを使用します。
        </p>
        <div className="table-wrap overflow-x-auto rounded-lg border border-brand-line bg-brand-card">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="bg-brand-bgRaised text-left text-brand-inkSoft">
                <th className="px-4 py-3 font-bold">重視するタイプ</th>
                <th className="px-4 py-3 font-bold">重み付けの考え方</th>
              </tr>
            </thead>
            <tbody>
              {axisScoreProfiles.map((profile) => {
                const entries = Object.entries(profile.weights) as [string, number][];
                const maxWeight = Math.max(...entries.map(([, w]) => w));
                const topAxes = entries.filter(([, w]) => w === maxWeight);
                const otherAxes = entries.filter(([, w]) => w !== maxWeight);
                const isEqual = topAxes.length === entries.length;
                const otherWeight = otherAxes[0]?.[1];
                return (
                  <tr key={profile.id} className="border-t border-brand-line align-top">
                    <td className="px-4 py-3 font-bold text-brand-ink">{profile.name}</td>
                    <td className="px-4 py-3 text-brand-inkSoft">
                      {isEqual
                        ? `5つのAXISを均等（各${formatWeightPct(maxWeight)}%）に評価`
                        : `${topAxes
                            .map(([key]) => axisDefinitions.find((d) => d.axisKey === key)?.label ?? key)
                            .join("・")}を${formatWeightPct(maxWeight)}%、その他${otherAxes.length}項目を各${formatWeightPct(otherWeight)}%として評価`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-brand-inkSoft">
          商品比較表・各記事では、この「重視するタイプ」を選ぶと総合スコアがその場で再計算されます。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">確認できない情報を0点にはしない</h2>
        <p className="text-brand-inkSoft">
          メーカーが公表していない項目や、まだ確認が済んでいない項目は、0点として扱うのではなく、その評価項目自体をスコアの計算対象から外します。AXISごとのスコアは、確認できた評価項目（verified）の配点の中だけで100点満点に正規化して算出しています。そのうえで、そのAXISの配点のうちどれだけの割合を確認できているかを「評価充足率（evaluationCoverage）」として算出し、確認できている情報がどれだけの範囲かを示す目安にしています。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">confirmed・参考・評価情報不足の意味</h2>
        <p className="mb-4 text-brand-inkSoft">
          評価充足率をもとに、スコアをどこまで信頼して表示してよいかを3段階に分けています。数値そのものだけでなく、この表示のしかたも含めてAXIS
          SCORE™です。
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-brand-line bg-brand-card p-4">
            <AxisScoreBadge score={87} trademark displayStatus="confirmed" />
            <p className="mt-3 text-sm text-brand-inkSoft">
              評価に必要な情報を十分に確認できている状態です。スコアをそのまま表示します。
              {axisWithCriticalCriteria && (
                <>
                  {" "}
                  {axisWithCriticalCriteria.label}のように特に重要な評価項目を持つAXISでは、その項目が未確認のままではconfirmedになりません。
                </>
              )}
            </p>
          </div>
          <div className="rounded-lg border border-brand-line bg-brand-card p-4">
            <AxisScoreBadge score={68} trademark displayStatus="provisional" />
            <p className="mt-3 text-sm text-brand-inkSoft">
              一定の評価はできているものの、confirmedの基準には届いていない状態です。「参考」という表示を必ず添えて、確認できている情報のみで算出した値であることを明示します。
            </p>
          </div>
          <div className="rounded-lg border border-brand-line bg-brand-card p-4">
            <AxisScoreBadge score={null} displayStatus="insufficient" />
            <p className="mt-3 text-sm text-brand-inkSoft">
              評価に必要な情報が大きく不足している状態です。数値は算出していても主表示はせず、「評価情報不足」とだけ表示します。重視している軸そのものの情報が大きく欠けている場合は、総合スコアも同様に「評価情報不足」として扱います。
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">価格対効果（price_value）の特別なルール</h2>
        <p className="text-brand-inkSoft">
          価格対効果は「安い商品ほど高得点」という単純なルールでは評価していません。支払う価格に対して、清掃性能・自動化機能・住宅適合性の面でどれだけ価値ある内容を得られるかを評価します。採点の基準にする価格は、セール等で変動する現在の実勢価格（currentPrice）ではなく、変動しにくい基準価格（referencePrice）です。現在価格は購入判断のための表示専用の情報であり、価格が変わってもAXIS
          SCORE™が自動的に変動することはありません。
        </p>
      </section>

      <section className="mb-10 rounded-lg border border-brand-line bg-brand-card p-5">
        <h2 className="mb-3 text-lg font-bold">AXIS SCORE™にできないこと</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-brand-inkSoft">
          <li>AXIS SCORE™は、購入判断を助けるための指標であり、商品の絶対的な優劣を決めるものではありません。最終的にどれを選ぶかは、読者ご自身が重視するポイントに沿って判断してください。</li>
          <li>メーカーが公表していない情報を推測・換算して埋めることはしません。確認できていない情報は、確認できていないものとして扱います。</li>
          <li>評価方法（ルーブリック）はバージョン管理しており、今後の情報更新や改善によって見直される可能性があります。</li>
        </ul>
      </section>

      <p className="text-sm text-brand-inkSoft">
        実際のAXIS SCORE™は、
        <Link href="/robot-vacuums" className="font-bold text-brand-accent underline">
          商品比較表
        </Link>
        や
        <Link href="/articles" className="mx-1 font-bold text-brand-accent underline">
          比較記事
        </Link>
        でご確認いただけます。
      </p>
    </article>
  );
}
