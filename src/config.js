import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import chalk from "chalk";
import { CONFIG_DIR, CONFIG_PATH } from "./constants.js";

export async function readConfig() {
  try {
    return JSON.parse(await readFile(CONFIG_PATH, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return { providers: {} };
    throw error;
  }
}

export async function writeConfig(config) {
  await mkdir(CONFIG_DIR, { recursive: true, mode: 0o700 });
  await writeFile(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`, {
    mode: 0o600,
  });
  await chmod(CONFIG_PATH, 0o600);
}

export function normalizeProvider(provider) {
  return provider.trim().toLowerCase();
}

export function requireProviderName(program) {
  const raw = program.opts().provider;
  const provider = raw?.trim().toLowerCase();
  if (!provider) {
    throw new Error(
      `Missing --provider. Example: ${chalk.cyan("cloudmind --provider do scan")}`,
    );
  }
  return provider;
}

export function getCredentials(config, provider) {
  return config.providers?.[provider];
}

export function requireCredentials(config, provider) {
  const credentials = getCredentials(config, provider);
  if (!credentials?.token) {
    throw new Error(
      `No token saved for "${provider}". Run: ${chalk.cyan(`cloudmind add ${provider}`)}`,
    );
  }
  return credentials;
}

export function getOpenAIKey(config) {
  const apiKey = process.env.OPENAI_API_KEY || config.openai?.apiKey;
  return typeof apiKey === "string" && apiKey.trim()
    ? apiKey.trim()
    : undefined;
}

export function requireOpenAIKey(config) {
  const apiKey = getOpenAIKey(config);
  if (!apiKey) {
    throw new Error(
      `No OpenAI API key configured. Run: ${chalk.cyan("cloudmind add openai")} or set OPENAI_API_KEY.`,
    );
  }
  return apiKey;
}
