import type { Metadata } from "next";
import Link from "next/link";
import { getComparison } from "@/lib/data";
import { buildPageMetadata } from "@/lib/site-config";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleAxisChecklist, type AxisChecklistItem } from "@/components/article/ArticleAxisChecklist";
import { ArticleRelatedArticles } from "@/components/article/ArticleRelatedArticles";
import { AxisScoreMethodologyTeaser } from "@/components/product-detail/AxisScoreMethodologyTeaser";

const SLUG = "robot-vacuum-how-to-choose";

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "ロボット掃除機で後悔しない選び方｜買う前に確認したい5つのポイント | えらぶ。",
    description:
      "ロボット掃除機は吸引力だけで選ぶと後悔しがちです。清掃性能・静音性・メンテナンス性・住宅適合性・価格対効果の5つの軸から、購入前に確認しておきたいポイントを解説します。",
    path: `/articles/${SLUG}`,
  });
}

// 5つのポイントの解説文。axisDefinitions.jsonのlabel/description/criteriaは
// ArticleAxisChecklist側で動的に取得するため、ここでは各軸固有の解説と関連記事だけを持つ。
const AXIS_CHECKLIST_ITEMS: AxisChecklistItem[] = [
  {
    axisKey: "cleaning_power",
    guidance:
      "吸引力の数値（Pa値）だけで判断せず、水拭きの方式、壁際や隅への対応、カーペット対応、清掃中の毛絡み対策まであわせて確認しましょう。カーペットを使っている場合は、カーペット対応の記載が商品ページにあるかを確認しておくと安心です。メーカーによっては吸引力の絶対値を公表していない場合もありますが、それだけを理由に清掃力が低いとは限りません。",
    relatedArticle: { slug: "robot-vacuum-cleaning-performance", label: "清掃性能で選ぶロボット掃除機の比較記事" },
  },
  {
    axisKey: "quietness",
    guidance:
      "運転音の具体的な数値（dB）を公式に確認できる商品と、非公表の商品があります。数値を確認できる場合は参考にできますが、非公表だからといって「静かではない」「性能が低い」ということにはなりません。夜間や在宅ワーク中に使いたい場合は、商品ページで運転音の公表状況と、静音モードの有無を確認しておきましょう。",
  },
  {
    axisKey: "maintainability",
    guidance:
      "自動ゴミ収集の有無、モップの自動洗浄・自動乾燥、ブラシに絡まった毛の除去のしやすさ、ステーション自体の手入れのしやすさを確認しましょう。自動化されている機能があっても、フィルターの清掃やダストバッグの交換など、手作業で残る手入れが何かをあわせて確認しておくと、購入後のギャップが少なくなります。",
    relatedArticle: { slug: "robot-vacuum-low-maintenance", label: "手入れが楽なロボット掃除機の比較記事" },
  },
  {
    axisKey: "space_fit",
    guidance:
      "本体の「幅」だけでなく「高さ」も確認しましょう。家具の下に入り込ませたい場合は、家具下の高さと本体の高さを見比べておくと確実です。ステーションを置く場所も、実際の設置スペースの幅・奥行きを測っておきましょう。段差乗り越え性能、障害物回避やマッピング方式も、自宅環境との相性を左右するポイントです。",
    relatedArticle: { slug: "robot-vacuum-narrow-room", label: "狭い家・マンション向けロボット掃除機の比較記事" },
  },
  {
    axisKey: "price_value",
    guidance:
      "「安い商品ほど高得点」ではありません。支払う価格に対して、清掃性能や自動化機能、住宅適合性の面でどれだけ価値ある内容を得られるかで考えましょう。商品ページの価格表記が参考価格か現在価格かを確認しておくと、他商品と正しく比較できます。比較の基準にする参考価格と、セール等で変動する現在の実勢価格は別物です。",
  },
];

export default function HowToChoosePage() {
  const comparison = getComparison(SLUG);

  return (
    <article className="max-w-3xl">
      <Breadcrumbs
        items={[
          { label: "ホーム", href: "/" },
          { label: "比較記事", href: "/articles" },
          { label: comparison?.title ?? "ロボット掃除機で後悔しない選び方" },
        ]}
      />

      {/* ① ファーストビュー */}
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-accent">選び方ガイド</p>
      <h1 className="mb-4 text-3xl font-bold">
        {comparison?.title ?? "ロボット掃除機で後悔しない選び方｜買う前に確認したい5つのポイント"}
      </h1>
      <div className="mb-10 space-y-3 text-brand-inkSoft">
        <p>
          「吸引力が強ければ大丈夫だろう」と思って選んでしまうと、実際に使い始めてから運転音や手入れの手間が気になることがあります。ロボット掃除機は吸引力だけで選ぶのではなく、住まいの環境まで含めて考える必要があります。あなたにとっての「絶対的な正解」は1つではなく、何を重視するかによって最適な商品は変わります。
        </p>
        <p>
          このページはランキング記事ではなく、購入前に確認しておきたいポイントを整理し、あなた自身の判断軸を見つけるためのガイドです。「えらぶ。」が使っている5つの比較軸（AXIS）に沿って、それぞれ何を確認すればよいかを解説します。
        </p>
      </div>

      {/* ② なぜ一つの正解がないのか */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">なぜ「絶対的な正解」がないのか</h2>
        <p className="text-brand-inkSoft">
          「えらぶ。」は、感想やランキングの順位ではなく、清掃性能・静音性・メンテナンス性・住宅適合性・価格対効果という5つの軸（AXIS）に分けて商品を評価しています。同じ商品でも、狭い家に住んでいる人と、とにかく清掃力を重視したい人では、評価が変わって当然だからです。評価方法の詳細は
          <Link href="/about-axis-score" className="mx-1 font-bold text-brand-accent underline">
            AXIS SCORE™とは
          </Link>
          で解説しています。
        </p>
      </section>

      {/* ③ 買う前に確認したい5つのポイント */}
      <section className="mb-10">
        <h2 className="mb-1 text-xl font-bold">買う前に確認したい5つのポイント</h2>
        <p className="mb-4 text-sm text-brand-inkSoft">
          「えらぶ。」の5つのAXISに沿って、それぞれ何を確認すればよいかをまとめました。数値の一律の合格ラインはありません。何を重視するかは、あなたの生活スタイル次第です。
        </p>
        <ArticleAxisChecklist items={AXIS_CHECKLIST_ITEMS} />
      </section>

      {/* ④ 自分の優先軸を決める */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">自分の優先軸を決めるには</h2>
        <p className="mb-4 text-sm text-brand-inkSoft">
          以下のような当てはまる項目から、次に読むと参考になる記事・ページへ進めます。
        </p>
        <ul className="space-y-3">
          <li className="rounded-lg border border-brand-line bg-brand-card p-4">
            <p className="font-bold text-brand-ink">夜間や在宅ワーク中に使いたい → 静音性を重視</p>
            <p className="mt-1 text-sm text-brand-inkSoft">
              まずは
              <Link href="/robot-vacuums" className="mx-1 font-bold text-brand-accent underline">
                比較表
              </Link>
              で、各商品の運転音の公表状況を確認してみましょう。
            </p>
          </li>
          <li className="rounded-lg border border-brand-line bg-brand-card p-4">
            <p className="font-bold text-brand-ink">掃除機自体の手入れをなるべく減らしたい → メンテナンス性を重視</p>
            <p className="mt-1 text-sm text-brand-inkSoft">
              <Link href="/articles/robot-vacuum-low-maintenance" className="font-bold text-brand-accent underline">
                手入れが楽なロボット掃除機5選
              </Link>
              で詳しく比較しています。
            </p>
          </li>
          <li className="rounded-lg border border-brand-line bg-brand-card p-4">
            <p className="font-bold text-brand-ink">設置スペース・家具下・段差など、自宅環境との相性が気になる → 住宅適合性を重視</p>
            <p className="mt-1 text-sm text-brand-inkSoft">
              <Link href="/articles/robot-vacuum-narrow-room" className="font-bold text-brand-accent underline">
                狭い家・マンション向けロボット掃除機5選
              </Link>
              で詳しく比較しています。
            </p>
          </li>
          <li className="rounded-lg border border-brand-line bg-brand-card p-4">
            <p className="font-bold text-brand-ink">とにかく清掃力を重視したい → 清掃性能を重視</p>
            <p className="mt-1 text-sm text-brand-inkSoft">
              <Link href="/articles/robot-vacuum-cleaning-performance" className="font-bold text-brand-accent underline">
                清掃性能で選ぶロボット掃除機5選
              </Link>
              で詳しく比較しています。
            </p>
          </li>
          <li className="rounded-lg border border-brand-line bg-brand-card p-4">
            <p className="font-bold text-brand-ink">予算とのバランスを重視したい → 価格対効果を重視</p>
            <p className="mt-1 text-sm text-brand-inkSoft">
              <Link href="/robot-vacuums" className="mx-1 font-bold text-brand-accent underline">
                比較表
              </Link>
              の価格上限での絞り込みや、価格対効果の列を参考にしてください。
            </p>
          </li>
        </ul>
      </section>

      {/* ⑤ 確認できないスペックとの付き合い方 */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">確認できないスペックとの付き合い方</h2>
        <p className="text-brand-inkSoft">
          メーカーが公表していない仕様は、0点として扱ったり「性能が低い」と決めつけたりせず、単に確認できていない情報として扱うのが「えらぶ。」の基本方針です。購入を検討する際も、公式情報で確認できる点とできない点を分けて考えると、後悔しない判断がしやすくなります。
        </p>
      </section>

      {/* 関連記事 */}
      <ArticleRelatedArticles slugs={comparison?.relatedSlugs ?? []} />

      {/* AXIS SCORE™について */}
      <AxisScoreMethodologyTeaser />

      {/* 情報について */}
      <section className="mb-4 text-xs text-brand-inkSoft">
        <p>最終確認日：{comparison?.updatedAt ?? "-"}（本記事の内容の確認日）</p>
        <p className="mt-1">商品仕様はメーカー公式情報を優先して掲載しています。価格・仕様は今後変更される可能性があります。</p>
        <p className="mt-1">現時点でアフィリエイトリンクは設定していません。購入先は各商品詳細ページのメーカー公式サイトリンクをご利用ください。</p>
      </section>
    </article>
  );
}
