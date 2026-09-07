import type { Metadata } from "next";
import Link from "next/link";
import { getComparison } from "@/lib/data";
import { buildPageMetadata } from "@/lib/site-config";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleAxisChecklist, type AxisChecklistItem } from "@/components/article/ArticleAxisChecklist";
import { ArticleRelatedArticles } from "@/components/article/ArticleRelatedArticles";
import { AxisScoreMethodologyTeaser } from "@/components/product-detail/AxisScoreMethodologyTeaser";
import { ArticleAffiliateFooterNote } from "@/components/article/ArticleAffiliateFooterNote";
import { hasAnySiteEnabledAffiliateLink } from "@/lib/affiliateStatus";

const SLUG = "robot-vacuum-how-to-choose";

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "ロボット掃除機で後悔しない選び方｜置き場所・手入れ・予算を確認 | えらぶ。",
    description:
      "ロボット掃除機の購入前に確認したい、置き場所・床や段差・残る手入れ・予算を整理。本体とドックの寸法、価格の見方、確認できない仕様への注意点をチェック表で案内します。",
    path: `/articles/${SLUG}`,
  });
}

interface PurchaseCheckItem {
  topic: string;
  check: string;
  caution: string;
  relatedArticle: { slug: string; label: string };
}

/**
 * 「購入前チェック表」。各行の根拠（自サイトの記事・既存コードとの整合か、メーカー一次情報の
 * 確認済み事実かを区別）：
 * - 置き場所：【一次情報＋自サイト整合】narrow-room記事の実寸監査（本体・ステーション寸法は別、
 *   設置余白は非公表の機種がある）と、本記事の既存space_fit解説に準拠。
 * - 段差：【自サイト整合】step-climbing記事の既存前提（メーカーごとに公表状況・測定条件が異なる）
 *   に準拠。具体的な数値・機種は挙げていない。
 * - 残る手入れ：【一次情報・2026-09-07に公式ページを直接開いて再確認】switchbot-s20の公式
 *   商品ページ（https://www.switchbot.jp/products/switchbot-robot-vacuum-cleaner-s20）に
 *   「2.7Lの水タンクと2.5Lの汚水タンクを備え、一週間に一度水を補給して汚水を捨てるだけ」と
 *   明記されていることを、本タスク中に同ページを開いて文言レベルで確認した（productAxisScores.json
 *   のstation_self_clean記録とも一致）。この1機種の確認済み事実を「例」として明示し、他機種へ
 *   一般化していない。
 * - 水拭き・床材：【未確認】床材側の水拭き適性は、メーカー・床材メーカーいずれの一次情報も
 *   今回確認していない。特定の床材名・可否を断定せず、「対象機種の説明書等で確認する項目」として
 *   のみ提示する。
 * - 運転音：本体清掃音60dBはswitchbot-s20の公式比較ページ（S20欄）に記載があることを確認済み
 *   （sourceUrl: https://www.switchbot.jp/pages/s1-s1plus-functional-comparison）。ステーションの
 *   モップ乾燥音「40dB以下」は【一次情報・2026-09-07に公式ページを直接開いて再確認】商品ページ
 *   に「洗浄後は50℃の熱風で自動乾燥（乾燥時間は1～8時間で設定可能。騒音は40dB以下）」と明記されて
 *   いることを本タスク中に確認した。本体清掃音とモップ乾燥音は別の数値であり、モップ乾燥音の
 *   根拠を自動ゴミ収集動作音の根拠に転用していない。「自動ゴミ収集動作音」自体の数値はこのDB内に
 *   存在しないため、確認できていない項目として明示する。
 * - 予算：【自サイト整合】ComparisonTable等、サイト全体で使っている「参考価格」と「確認済み価格
 *   （現在価格）」の区別にもとづく。
 */
const PURCHASE_CHECKLIST: PurchaseCheckItem[] = [
  {
    topic: "置き場所（本体・ドックの寸法）",
    check: "本体の幅・奥行き・高さ、ステーション（ドック）の幅・奥行き・高さ",
    caution:
      "本体寸法・ドック寸法・設置に必要な余白はそれぞれ別の数値です。本体の高さだけで「家具下に入る」とは判断できません。家具下の実測値ともあわせて確認しましょう。設置に必要な余白は、メーカー公式情報で確認できていない商品もあります。",
    relatedArticle: { slug: "robot-vacuum-narrow-room", label: "狭い家・1LDK向けロボット掃除機5選" },
  },
  {
    topic: "段差",
    check: "乗り越え可能な段差の高さ（mm）の公表状況",
    caution:
      "段差対応は高さの数値だけでなく、段差の形状や測定条件（メーカーによって条件が異なる場合があります）もあわせて確認しましょう。数値が非公表の商品は「乗り越えられない」という意味ではありません。",
    relatedArticle: { slug: "robot-vacuum-step-climbing", label: "ロボット掃除機の段差対応を比較" },
  },
  {
    topic: "残る手入れ",
    check: "自動ゴミ収集・モップ自動洗浄・自動乾燥の有無",
    caution:
      "自動ゴミ収集やモップ自動洗浄があっても、人が行う作業が残る機種があります（例：ステーションの給水・排水タンクを週に一度程度、手動で管理する必要があると公式に確認できた機種があります）。「自動化機能がある＝手入れ不要」とは限らないため、対象機種の取扱説明書で残る作業を確認しましょう。",
    relatedArticle: { slug: "robot-vacuum-low-maintenance", label: "手入れが楽なロボット掃除機5選" },
  },
  {
    topic: "水拭き・床材",
    check: "商品側の水拭き方式・対応状況",
    caution:
      "水拭き機能の対応可否に加えて、ご自宅の床材（フローリングの種類等）が水拭きに適しているかどうかは、対象機種の取扱説明書や、床材・住宅メーカーのサポート情報で確認しておきたい項目です。当サイトでは商品ごとの床材別の適否は確認していません。",
    relatedArticle: { slug: "robot-vacuum-mopping", label: "水拭きに強いロボット掃除機5選" },
  },
  {
    topic: "運転音",
    check: "本体清掃時の運転音（dB）の公表状況",
    caution:
      "機種によっては、本体清掃音とは別に、ステーションのモップ乾燥時の運転音が公式に公表されています。清掃音だけを見て「静か」と判断せず、ステーション動作時の音も確認しましょう。なお、自動ゴミ収集動作時の音については、当サイトで数値を確認できた機種がないため、対象機種の説明書等で個別にご確認ください。",
    relatedArticle: { slug: "robot-vacuum-quietness", label: "静かなロボット掃除機を選ぶには" },
  },
  {
    topic: "予算",
    check: "参考価格と、確認済みの現在価格",
    caution:
      "比較の基準にする参考価格と、セール等で変動する現在の実勢価格（確認済み価格）は別物です。購入直前は必ず販売店で最新価格を確認しましょう。",
    relatedArticle: { slug: "robot-vacuum-cost-value", label: "コスパで選ぶロボット掃除機5選" },
  },
];

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
    relatedArticle: { slug: "robot-vacuum-narrow-room", label: "狭い家・1LDK向けロボット掃除機の比較記事" },
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
        {comparison?.title ?? "ロボット掃除機で後悔しない選び方｜置き場所・手入れ・予算を確認"}
      </h1>
      <div className="mb-10 space-y-3 text-brand-inkSoft">
        <p>
          「吸引力が強ければ大丈夫だろう」と思って選んでしまうと、実際に使い始めてから運転音や手入れの手間が気になることがあります。ロボット掃除機は吸引力だけで選ぶのではなく、住まいの環境まで含めて考える必要があります。あなたにとっての「絶対的な正解」は1つではなく、何を重視するかによって最適な商品は変わります。
        </p>
        <p>
          確認する順番の目安は、①置き場所（本体・ドックが入るか）→②床・段差（水拭きの可否や段差対応）→③残る手入れ（自動化されない作業）→④予算（確認済み価格と参考価格の違い）です。このページはランキング記事ではなく、購入前に確認しておきたいポイントを整理し、あなた自身の判断軸を見つけるためのガイドです。
        </p>
      </div>

      {/* ② 購入前チェック表 */}
      <section className="mb-10">
        <h2 className="mb-1 text-xl font-bold">購入前チェック表</h2>
        <p className="mb-4 text-sm text-brand-inkSoft">
          購入前に確認しておきたい項目と、判断するときに注意したい点をまとめました。各項目をより詳しく比較したい場合は、リンク先の記事をご覧ください。
        </p>
        <div className="overflow-x-auto rounded-lg border border-brand-line">
          <table className="w-full min-w-[720px] border-collapse bg-brand-card text-sm">
            <thead>
              <tr className="bg-brand-bgRaised text-left text-brand-inkSoft">
                <th className="px-4 py-3 font-bold">確認するもの</th>
                <th className="px-4 py-3 font-bold">判断するときの注意</th>
                <th className="px-4 py-3 font-bold">詳しく読む既存記事</th>
              </tr>
            </thead>
            <tbody>
              {PURCHASE_CHECKLIST.map((item) => (
                <tr key={item.topic} className="border-t border-brand-line align-top">
                  <td className="px-4 py-3">
                    <p className="font-bold text-brand-ink">{item.topic}</p>
                    <p className="mt-1 text-xs text-brand-inkSoft">{item.check}</p>
                  </td>
                  <td className="px-4 py-3 text-brand-inkSoft">{item.caution}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Link href={`/articles/${item.relatedArticle.slug}`} className="font-bold text-brand-accent underline">
                      {item.relatedArticle.label}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ③ 各チェック項目の説明（AXIS SCORE™の5軸に沿った補足。「なぜ絶対的な正解がないのか」の内容をここに統合） */}
      <section className="mb-10">
        <h2 className="mb-1 text-xl font-bold">各チェック項目の説明</h2>
        <p className="mb-4 text-sm text-brand-inkSoft">
          「えらぶ。」は、感想やランキングの順位ではなく、清掃性能・静音性・メンテナンス性・住宅適合性・価格対効果という5つの軸（AXIS）に分けて商品を評価しています。数値の一律の合格ラインはなく、何を重視するかはあなたの生活スタイル次第です。評価方法の詳細は
          <Link href="/about-axis-score" className="mx-1 font-bold text-brand-accent underline">
            AXIS SCORE™とは
          </Link>
          で解説しています。
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
              <Link href="/articles/robot-vacuum-quietness" className="font-bold text-brand-accent underline">
                静かなロボット掃除機を選ぶには
              </Link>
              で、各商品の運転音の公表状況を整理しています。
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
                狭い家・1LDK向けロボット掃除機5選
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
              <Link href="/articles/robot-vacuum-cost-value" className="font-bold text-brand-accent underline">
                コスパで選ぶロボット掃除機5選
              </Link>
              で詳しく比較しています。
            </p>
          </li>
        </ul>
      </section>

      {/* ⑤ 購入前によくある疑問 */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-bold">購入前によくある疑問</h2>
        <div className="space-y-4">
          <div>
            <p className="font-bold text-brand-ink">スペックが「非公表」の商品は避けた方がいい？</p>
            <p className="mt-1 text-sm text-brand-inkSoft">
              メーカーが公表していない仕様は、0点として扱ったり「性能が低い」と決めつけたりせず、単に確認できていない情報として扱うのが「えらぶ。」の基本方針です。購入を検討する際も、公式情報で確認できる点とできない点を分けて考えると、後悔しない判断がしやすくなります。
            </p>
          </div>
          <div>
            <p className="font-bold text-brand-ink">この比較は、実際に商品を使った感想ですか？</p>
            <p className="mt-1 text-sm text-brand-inkSoft">
              いいえ。「えらぶ。」の評価は、現時点では編集部による実機検証ではなく、メーカー公式サイト等で確認できた公表情報にもとづいています。運営方針の詳細は
              <Link href="/about" className="mx-1 font-bold text-brand-accent underline">
                運営者情報・編集方針
              </Link>
              をご覧ください。
            </p>
          </div>
        </div>
      </section>

      {/* 関連記事 */}
      <ArticleRelatedArticles slugs={comparison?.relatedSlugs ?? []} />

      {/* AXIS SCORE™について */}
      <AxisScoreMethodologyTeaser />

      {/* 情報について */}
      <section className="mb-4 text-xs text-brand-inkSoft">
        <p>最終確認日：{comparison?.updatedAt ?? "-"}（本記事の内容の確認日）</p>
        <p className="mt-1">商品仕様はメーカー公式情報を優先して掲載しています。価格・仕様は今後変更される可能性があります。</p>
        <ArticleAffiliateFooterNote hasAffiliateLink={hasAnySiteEnabledAffiliateLink()} />
      </section>
    </article>
  );
}
