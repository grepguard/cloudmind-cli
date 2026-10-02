export async function requestJson(url, token, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const body = await response.text();
  let data;
  try {
    data = body ? JSON.parse(body) : {};
  } catch {
    data = body;
  }

  if (!response.ok) {
    const detail = typeof data === "string" ? data : data.error || data.message;
    throw new Error(
      `API returned ${response.status}${detail ? `: ${detail}` : ""}`,
    );
  }
  return data;
}
