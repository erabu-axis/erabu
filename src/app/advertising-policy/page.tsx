import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildPageMetadata } from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: "広告・アフィリエイトポリシー | えらぶ。",
  description:
    "「えらぶ。」における広告・アフィリエイトリンクの取り扱い方針、AXIS SCORE™の評価と収益化の分離方針について説明します。",
  path: "/advertising-policy",
});

export default function AdvertisingPolicyPage() {
  return (
    <article className="max-w-3xl">
      <Breadcrumbs items={[{ label: "ホーム", href: "/" }, { label: "広告・アフィリエイトポリシー" }]} />
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-accent">Advertising Policy</p>
      <h1 className="mb-4 text-3xl font-bold">広告・アフィリエイトポリシー</h1>
      <p className="mb-10 max-w-2xl text-brand-inkSoft">
        「えらぶ。」（以下「当サイト」といいます）における、広告・アフィリエイトリンクの取り扱いと、AXIS SCORE™による評価との関係について説明します。
      </p>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">1. 広告・アフィリエイトリンクについて</h2>
        <p className="text-brand-inkSoft">
          当サイトは、記事内の購入先リンクを通じて、提携先（アフィリエイトプログラム等）から紹介料を受け取る形での収益化を将来的に行う可能性があります。現時点で、当サイトはいずれのアフィリエイトプログラム・広告配信サービスにも参加していません。導入する場合は、その事実と提携先の種類をこのページに追記します。
        </p>
      </section>

      <section className="mb-10 rounded-lg border border-brand-line bg-brand-card p-5">
        <h2 className="mb-3 text-lg font-bold">2. AXIS SCORE™・編集評価との分離</h2>
        <p className="text-brand-inkSoft">
          広告・アフィリエイトの導入有無にかかわらず、AXIS SCORE™の採点内容や商品の評価は、広告主・提携先との関係によって変更しません。評価の仕組みと収益化の仕組みは分離して運営します。評価方法の詳細は
          <Link href="/about-axis-score" className="mx-1 font-bold text-brand-accent underline">
            AXIS SCORE™とは
          </Link>
          をご覧ください。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">3. 広告主から評価結果を変更させない方針</h2>
        <p className="text-brand-inkSoft">
          広告出稿や業務提携の有無が、AXIS SCORE™の採点結果・商品比較表での並び順・比較記事内の評価内容に影響を与えることはありません。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">4. PR・広告案件の明示</h2>
        <p className="text-brand-inkSoft">
          将来、企業からの商品提供にもとづくレビューやタイアップコンテンツ（いわゆるPR・広告案件）を掲載する場合は、該当する記事・コンテンツにその旨を明示します。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">5. 商品価格・在庫・仕様について</h2>
        <p className="text-brand-inkSoft">
          当サイトに掲載する価格・在庫・仕様等の情報は、掲載時点で確認できた情報にもとづくものです。価格・在庫状況・仕様は変更される場合があるため、実際の購入にあたっては、必ず販売元・メーカー公式サイト等で最終確認をお願いします。
        </p>
      </section>

      <p className="text-xs text-brand-inkSoft">最終更新日：2026-09-03</p>
    </article>
  );
}
