/**
 * 記事末尾の購入先注記。有効なアフィリエイトリンクの有無で文言を自動的に切り替える。
 * 実リンクの掲載開始・停止のたびに各記事ファイルを手動修正しなくてよいようにする。
 */
export function ArticleAffiliateFooterNote({ hasAffiliateLink }: { hasAffiliateLink: boolean }) {
  if (hasAffiliateLink) {
    return (
      <p className="mt-1">
        商品によっては、購入先ボタンにアフィリエイトプログラムによる広告リンクを含みます。該当する場合は、購入先ボタン付近にその旨を表示しています。
      </p>
    );
  }
  return (
    <p className="mt-1">現時点でアフィリエイトリンクは設定していません。購入先は各商品詳細ページのメーカー公式サイトリンクをご利用ください。</p>
  );
}
