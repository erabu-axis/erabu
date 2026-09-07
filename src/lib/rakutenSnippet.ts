/**
 * 楽天アフィリエイトツールが生成した「テキストのみ」のHTMLタグを表示してよいかを検証する。
 * 公式ガイドライン（https://affiliate.rakuten.co.jp/guideline/rule/）上、生成されたタグ自体の
 * 改変は禁止されているため、このチェックは内容の書き換え・除去を一切行わず、
 * 「そのまま表示して安全か」の判定のみを行う。安全と判定できない場合は表示せず、
 * 呼び出し側でその理由を報告できるようにする。
 */

const ALLOWED_TAGS = new Set(["a", "img"]);
const DANGEROUS_PATTERN = /<script|<iframe|<object|<embed|<link|<meta|<style|javascript:|data:text\/html|on\w+\s*=/i;
const MAX_LENGTH = 4000;

export interface RakutenSnippetCheckResult {
  safe: boolean;
  reason?: string;
}

export function checkRakutenSnippet(html: string | null | undefined): RakutenSnippetCheckResult {
  if (!html || !html.trim()) {
    return { safe: false, reason: "楽天生成HTMLが未設定です" };
  }
  const trimmed = html.trim();

  if (trimmed.length > MAX_LENGTH) {
    return { safe: false, reason: `想定より長すぎます（${trimmed.length}文字 > ${MAX_LENGTH}文字）` };
  }

  if (DANGEROUS_PATTERN.test(trimmed)) {
    return {
      safe: false,
      reason: "script/iframe/embed/style/インラインイベントハンドラ等、想定外の内容が含まれています",
    };
  }

  const tagNames = new Set<string>();
  for (const m of trimmed.matchAll(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b/g)) {
    tagNames.add(m[1].toLowerCase());
  }
  if (tagNames.size === 0) {
    return { safe: false, reason: "HTMLタグが見つかりません" };
  }
  for (const tag of tagNames) {
    if (!ALLOWED_TAGS.has(tag)) {
      return { safe: false, reason: `想定外のタグ <${tag}> が含まれています（許可タグ: ${[...ALLOWED_TAGS].join(", ")}）` };
    }
  }

  if (!/<a\s+[^>]*href=/i.test(trimmed)) {
    return { safe: false, reason: "href属性を持つ<a>タグが見つかりません" };
  }

  return { safe: true };
}
