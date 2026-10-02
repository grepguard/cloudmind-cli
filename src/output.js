import chalk from "chalk";
import { API_BASE_URL, CONFIG_PATH, SCAN_RESOURCE_KEYS } from "./constants.js";
import { renderMarkdown } from "./markdown.js";

export function printSaved(provider) {
  console.log(chalk.green(`\n✔ Saved "${provider}" credentials.`));
  console.log(`  ${chalk.dim("→")} ${chalk.cyan(CONFIG_PATH)}`);
  console.log(
    chalk.dim(`\nNext: ${chalk.cyan(`cloudmind --provider ${provider} scan`)}`),
  );
}

function maskToken(token) {
  if (!token) return chalk.dim("missing");
  const last4 = token.length > 4 ? token.slice(-4) : "";
  return `${chalk.dim("••••••••")}${last4 ? chalk.dim(last4) : ""}`;
}

export function printProviders(config) {
  const entries = Object.entries(config.providers ?? {});

  if (entries.length === 0) {
    console.log(chalk.yellow("No providers saved yet."));
    console.log(
      chalk.dim(`Run ${chalk.cyan("cloudmind add <provider>")} to save one.`),
    );
    console.log(chalk.dim(`Storage: ${CONFIG_PATH}`));
    return;
  }

  console.log(chalk.bold(`Saved providers (${entries.length})`));
  console.log(chalk.dim(`API: ${API_BASE_URL}`));
  console.log(chalk.dim(`Storage: ${CONFIG_PATH}\n`));

  for (const [name, credentials] of entries) {
    console.log(
      `  ${chalk.green("✔")} ${chalk.bold.cyan(name)}  ${maskToken(credentials?.token)}`,
    );
  }
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
