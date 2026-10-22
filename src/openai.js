import { OPENAI_MODEL } from "./constants.js";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

export async function answerQuestion(apiKey, provider, question, scan) {
  let response;
  try {
    response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(120_000),
      body: JSON.stringify({
        model: OPENAI_MODEL,
        reasoning: { effort: "medium" },
        store: false,
        instructions: `You are CloudMind, an infrastructure assistant. Answer the user's question using only the provided ${provider} inventory scan JSON. Be concise, cite resource names or IDs, and say when the data is insufficient. If the scan includes errors, explain which parts of the inventory could not be scanned and avoid drawing conclusions from missing data.`,
        input: `Question: ${question}\n\nInventory scan (${provider}):\n${JSON.stringify(scan)}`,
      }),
    });
  } catch (error) {
    throw new Error(`OpenAI request failed: ${error.message}`);
  }

  const body = await response.text();
  let data;
  try {
    data = body ? JSON.parse(body) : {};
  } catch {
    data = { error: { message: body } };
  }

  if (!response.ok) {
    const detail = data.error?.message || `HTTP ${response.status}`;
    throw new Error(`OpenAI request failed: ${detail}`);
  }

  const answer =
    data.output_text ||
    data.output
      ?.filter((item) => item.type === "message")
      .flatMap((item) => item.content || [])
      .filter((item) => item.type === "output_text")
      .map((item) => item.text)
      .join("\n") ||
    "";

  return {
    provider,
    question,
    answer,
    summary: scan.summary,
    scanned_at: scan.scanned_at,
  };
}
