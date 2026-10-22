import chalk from "chalk";
import { CONFIG_PATH, SCAN_RESOURCE_KEYS } from "./constants.js";
import { renderMarkdown } from "./markdown.js";

export function printSaved(provider) {
  console.log(chalk.green(`\n✔ Saved "${provider}" credentials.`));
  console.log(`  ${chalk.dim("→")} ${chalk.cyan(CONFIG_PATH)}`);
  const next =
    provider.toLowerCase() === "openai"
      ? 'cloudmind --provider do ask "How can I optimize my infrastructure?"'
      : `cloudmind --provider ${provider} scan`;
  console.log(chalk.dim(`\nNext: ${chalk.cyan(next)}`));
}

function maskToken(token) {
  if (!token) return chalk.dim("missing");
  const last4 = token.length > 4 ? token.slice(-4) : "";
  return `${chalk.dim("••••••••")}${last4 ? chalk.dim(last4) : ""}`;
}

export function printProviders(config) {
  const entries = Object.entries(config.providers ?? {});
  const openaiConfigured = Boolean(
    process.env.OPENAI_API_KEY || config.openai?.apiKey,
  );

  if (entries.length === 0 && !openaiConfigured) {
    console.log(chalk.yellow("No credentials configured yet."));
    console.log(
      chalk.dim(
        `Run ${chalk.cyan("cloudmind add do")} for DigitalOcean and ${chalk.cyan("cloudmind add openai")} to enable ask.`,
      ),
    );
    console.log(chalk.dim(`Storage: ${CONFIG_PATH}`));
    return;
  }

  console.log(chalk.bold(`Saved cloud providers (${entries.length})`));
  console.log(chalk.dim(`Storage: ${CONFIG_PATH}\n`));

  for (const [name, credentials] of entries) {
    console.log(
      `  ${chalk.green("✔")} ${chalk.bold.cyan(name)}  ${maskToken(credentials?.token)}`,
    );
  }

  console.log(
    `  ${openaiConfigured ? chalk.green("✔") : chalk.dim("○")} ${chalk.bold.cyan("OpenAI")}  ${openaiConfigured ? chalk.dim("API key configured") : chalk.dim("not configured (ask requires it)")}`,
  );
}

export function printScanResult(provider, result) {
  console.log(
    `${chalk.bold("\nCloud scan")} ${chalk.dim("·")} ${chalk.cyan(provider)}`,
  );

  if (result.scanned_at) {
    console.log(chalk.dim(`Scanned at ${result.scanned_at}`));
  }

  if (result.summary && typeof result.summary === "object") {
    console.log(chalk.bold("\nSummary"));
    for (const [name, count] of Object.entries(result.summary)) {
      const styledCount = count === 0 ? `${count}` : chalk.bold.green(count);
      console.log(`  ${name.replaceAll("_", " ")}: ${styledCount}`);
    }
  }

  if (result.errors && typeof result.errors === "object") {
    console.log(chalk.yellow("\nSome resources could not be scanned:"));
    for (const [name, error] of Object.entries(result.errors)) {
      console.log(`  ${name}: ${error}`);
    }
  }

  const resources = Object.fromEntries(
    SCAN_RESOURCE_KEYS.filter((name) => Array.isArray(result[name])).map(
      (name) => [name, result[name]],
    ),
  );

  console.log(chalk.bold("\nResources"));
  console.log(JSON.stringify(resources, null, 2));
}

export function printAnswer(provider, result) {
  console.log(
    `${chalk.bold("\nCloudmind")} ${chalk.dim("·")} ${chalk.cyan(provider)}\n`,
  );
  if (typeof result?.answer === "string") {
    console.log(renderMarkdown(result.answer));
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
}
