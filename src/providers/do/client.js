const DO_API = "https://api.digitalocean.com";

export async function doGet(token, path) {
  const response = await fetch(`${DO_API}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(12_000),
  });

  if (response.status === 401 || response.status === 403) {
    const error = new Error("Invalid DigitalOcean token");
    error.status = 401;
    throw error;
  }
  if (response.status === 429) {
    throw new Error(
      "DigitalOcean rate limited the request; try again shortly.",
    );
  }
  if (!response.ok) {
    throw new Error(`DigitalOcean API error: ${response.status}`);
  }
  return response.json();
}
