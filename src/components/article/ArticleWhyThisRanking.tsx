/**
 * 比較記事テンプレートv1.0の④「なぜこの順位？」。
 * weight（%）はaxisScoreProfiles.jsonの実際の値から呼び出し側で計算して渡す（ここではハードコードしない）。
 * 「評価情報不足のAXISは0点扱いしない」という説明は全記事共通のため、ここに1箇所だけ持つ。
 * rubricの内部監査用語（scoreDisplayStatus・criticalCriteria等）はここでは使わない。
 */
export function ArticleWhyThisRanking({
  primaryAxisLabel,
  primaryAxisWeightPct,
  otherAxisWeightPct,
  reasonSentence,
  axisDetailSentence,
}: {
  primaryAxisLabel: string;
  primaryAxisWeightPct: string;
  otherAxisWeightPct: string;
  /** この記事でこのAXISを重視する理由（1文程度） */
  reasonSentence: string;
  /** 該当AXISが具体的に何を評価しているかの補足（任意、axisDefinitions.jsonの内容に沿って呼び出し側で用意する） */
  axisDetailSentence?: string;
}) {
  return (
    <section className="mb-10 rounded-lg border border-brand-line bg-brand-card p-5">
      <h2 className="mb-2 text-lg font-bold">なぜこの順位？</h2>
      <div className="space-y-3 text-sm text-brand-inkSoft">
        <p>
          今回のランキングは、{primaryAxisLabel}を{primaryAxisWeightPct}%、その他4項目を各{otherAxisWeightPct}
          %として比較した結果です。{reasonSentence}
        </p>
        {axisDetailSentence && <p>{axisDetailSentence}</p>}
        <p>
          評価情報が不足しているAXISは0点として扱っているわけではありません。確認できているAXISだけで計算し、不足分は「参考」または「評価情報不足」として区別して表示しています。特定のAXISの評価情報が総合スコアに占める割合が大きい場合は、総合スコア自体を「評価情報不足」として扱うこともあります。
        </p>
      </div>
    </section>
  );
}
