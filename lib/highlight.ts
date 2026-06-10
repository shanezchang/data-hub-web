export function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!));
}

export function highlightJson(src: string): string {
  return escapeHtml(src).replace(
    /("(?:\\.|[^"\\])*")(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,
    (m, str: string | undefined, colon: string | undefined) => {
      if (str) return colon ? `<span class="tok-key">${str}</span>${colon}` : `<span class="tok-str">${str}</span>`;
      return `<span class="tok-num">${m}</span>`;
    },
  );
}
