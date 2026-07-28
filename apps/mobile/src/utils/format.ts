export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function formatDateTime(value?: string) {
  if (!value) {
    return "Not downloaded";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function markdownBlocks(markdown: string) {
  return markdown
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.startsWith("# ")) {
        return { type: "heading" as const, text: line.slice(2) };
      }

      if (line.startsWith("- ")) {
        return { type: "bullet" as const, text: line.slice(2) };
      }

      return { type: "paragraph" as const, text: line };
    });
}
