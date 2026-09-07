import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildPageMetadata } from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: "プライバシーポリシー | えらぶ。",
  description:
    "「えらぶ。」における個人情報の取扱い、アクセス解析・Cookieの利用状況、外部サービスとの関係について説明します。",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl">
      <Breadcrumbs items={[{ label: "ホーム", href: "/" }, { label: "プライバシーポリシー" }]} />
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-accent">Privacy</p>
      <h1 className="mb-4 text-3xl font-bold">プライバシーポリシー</h1>
      <p className="mb-10 max-w-2xl text-brand-inkSoft">
        「えらぶ。」（以下「当サイト」といいます）は、読者の皆様のプライバシーを尊重し、以下の方針で個人情報を取り扱います。本ページの内容は、当サイトが導入するサービス内容の確定にあわせて随時更新します。
      </p>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">1. 個人情報の取扱い</h2>
        <p className="text-brand-inkSoft">
          当サイトは現時点で、会員登録・お問い合わせフォームなど、読者の皆様から個人情報を直接取得する仕組みを設けていません。今後、お問い合わせ窓口などを設置する場合は、取得する情報の範囲と利用目的をこのページに明記します。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">2. お問い合わせ時に取得する可能性のある情報</h2>
        <p className="text-brand-inkSoft">
          お問い合わせ方法（メール等）を導入する際は、氏名・メールアドレスなど、お問い合わせ対応に必要な範囲の情報を取得する可能性があります。取得する情報の詳細は、お問い合わせ窓口の設置にあわせてこのページに明記します。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">3. アクセス解析</h2>
        <p className="text-brand-inkSoft">
          当サイトは、サイトの利用状況を把握する目的でGoogleアナリティクス4（GA4）を導入しています。GA4により、ページの閲覧状況や、商品ページ・比較記事内の購入先リンクのクリック状況（どの商品・どの販売店へのリンクがクリックされたか）を計測します。取得するのは個人を特定できない形式の閲覧・操作データです。このクリック計測は、リンク先での購入や成果の発生を示すものではありません。GA4の利用にともない、データはGoogleに送信されます。取り扱いの詳細はGoogleのプライバシーポリシーをご確認ください。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">4. Cookie（クッキー）</h2>
        <p className="text-brand-inkSoft">
          上記のGA4は、アクセス解析のためにCookie等の技術を利用してブラウザを識別します。当サイトはこれ以外の目的でCookieを利用した個人の識別・追跡を行っていません。広告配信のためにCookieを利用するサービスを導入する場合は、その内容をこのページに追記し、必要に応じて同意取得の方法もあわせて整備します。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">5. 外部サービス</h2>
        <p className="text-brand-inkSoft">
          当サイトの掲載情報は、メーカー公式サイトなど外部の情報をもとに編集部が確認したものです。将来、購入先リンク（アフィリエイトリンク等）を設置する場合、リンク先の外部サイトにおける情報の取扱いは、各サービスのプライバシーポリシーに従います。広告・アフィリエイトとの関係については、
          <Link href="/advertising-policy" className="mx-1 font-bold text-brand-accent underline">
            広告・アフィリエイトポリシー
          </Link>
          もあわせてご確認ください。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">6. プライバシーポリシーの変更</h2>
        <p className="text-brand-inkSoft">
          本ポリシーの内容は、法令の変更やサービス内容の追加に応じて、予告なく変更する場合があります。変更後の内容は、本ページに掲載した時点から効力を持つものとします。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">7. お問い合わせ</h2>
        <p className="text-brand-inkSoft">本ポリシーに関するお問い合わせ方法は現在準備中です。</p>
      </section>

      <p className="text-xs text-brand-inkSoft">最終更新日：2026-09-07</p>
    </article>
  );
}
