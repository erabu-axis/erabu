import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildPageMetadata } from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: "運営者情報・編集方針 | えらぶ。",
  description:
    "「えらぶ。」の運営方針・編集ポリシーを紹介します。メーカー公式情報をもとに商品を確認し、確認できない情報を推測で補わない方針で、AXIS SCORE™による比較を行っています。",
  path: "/about",
});

export default function AboutPage() {
  return (
    <article className="max-w-3xl">
      <Breadcrumbs items={[{ label: "ホーム", href: "/" }, { label: "えらぶ。について" }]} />
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-accent">About</p>
      <h1 className="mb-4 text-3xl font-bold">えらぶ。について</h1>
      <p className="mb-10 max-w-2xl text-lg font-bold text-brand-ink">くらべて、自分の軸でえらぶ。</p>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">「えらぶ。」とは</h2>
        <p className="text-brand-inkSoft">
          「えらぶ。」は、感想やランキングの順位ではなく、比較の軸（AXIS）で「結局どっちを選べばいいか」に結論を出す比較サイトです。同じ商品でも、何を重視するかによって最適な選択は変わります。私たちは商品を単一の順位で並べるのではなく、清掃性能・静音性・メンテナンス性・住宅適合性・価格対効果という複数の軸に分けてスコア化することで、読者一人ひとりが自分の状況に合わせて商品を選べることを目指しています。現在はロボット掃除機クラスターを展開しています。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">編集方針</h2>
        <ul className="list-inside list-disc space-y-2 text-brand-inkSoft">
          <li>商品情報は、メーカー公式サイトなど一次情報を確認できたものだけを掲載します。</li>
          <li>確認できていない仕様・数値は、推測や換算で補うことはしません。「非公表」「未確認」はそのまま「非公表」「未確認」として扱います。</li>
          <li>各商品ページには、情報源の種類（メーカー公式サイト等）と、最終確認日を明記しています。</li>
          <li>価格情報には確認日時点のものであることを明記し、比較の基準にする価格と、セール等で変動する現在の実勢価格を区別して扱います。</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">AXIS SCORE™について</h2>
        <p className="mb-3 text-brand-inkSoft">
          AXIS SCORE™は、上記の編集方針にもとづいて算出する「えらぶ。」独自の指標です。評価項目・重み付け・スコアの信頼度の表し方など、評価方法の詳細は以下のページで説明しています。
        </p>
        <Link href="/about-axis-score" className="font-bold text-brand-accent underline">
          AXIS SCORE™とは →
        </Link>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">広告・アフィリエイトとの関係</h2>
        <p className="text-brand-inkSoft">
          「えらぶ。」は将来、購入先リンク経由の紹介料（アフィリエイト）等による収益化を行う可能性がありますが、その場合も広告主・提携先との関係がAXIS
          SCORE™の採点内容に影響を与えることはありません。評価と収益化の仕組みは分離して運営します。詳細は
          <Link href="/advertising-policy" className="mx-1 font-bold text-brand-accent underline">
            広告・アフィリエイトポリシー
          </Link>
          をご覧ください。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">運営者情報</h2>
        <dl className="space-y-3 text-brand-inkSoft">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-brand-inkSoft">運営者名</dt>
            <dd className="mt-0.5">準備中</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-brand-inkSoft">運営形態</dt>
            <dd className="mt-0.5">準備中</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-brand-inkSoft">お問い合わせ</dt>
            <dd className="mt-0.5">準備中</dd>
          </div>
        </dl>
      </section>
    </article>
  );
}
