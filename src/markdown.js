import { marked } from "marked";
import { markedTerminal } from "marked-terminal";

marked.use(markedTerminal());

export function renderMarkdown(text) {
  if (typeof text !== "string" || text.trim().length === 0) return text;
  try {
    return marked.parse(text);
  } catch {
    return text;
  }
}
