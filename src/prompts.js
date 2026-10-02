import chalk from "chalk";
import inquirer from "inquirer";
import { CONFIG_PATH } from "./constants.js";

// Single prompt style for the whole CLI: cyan `>` while asking, green `✔` when done.
const promptTheme = {
  prefix: {
    idle: chalk.cyan(">"),
    done: chalk.green("✔"),
  },
};

export function printStorageLocation() {
  console.log(chalk.dim("Token will be saved to:"));
  console.log(`  ${chalk.cyan(CONFIG_PATH)} ${chalk.dim("(mode 0600)")}\n`);
}

export async function promptForProviderCredentials(provider, existing) {
  printStorageLocation();

  if (existing?.token) {
    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: `${chalk.yellow("A token for")} ${chalk.bold(`"${provider}"`)} ${chalk.yellow("already exists. Overwrite it?")}`,
        default: false,
        theme: promptTheme,
      },
    ]);
    if (!overwrite) {
      console.log(chalk.yellow("Kept existing credentials. Nothing changed."));
      return null;
    }
  }

  return inquirer.prompt([
    {
      type: "password",
      name: "token",
      // Never reveal the token: no ctrl+t toggle, always masked.
      mask: "•",
      toggleMask: false,
      theme: promptTheme,
      message: chalk.bold("API token:"),
      validate: (value) =>
        value.trim().length > 0
          ? true
          : "Token can't be empty — paste it to continue.",
    },
  ]);
}

export async function promptForQuestion() {
  const { question } = await inquirer.prompt([
    {
      type: "input",
      name: "question",
      theme: promptTheme,
      message: chalk.bold("What would you like to know about your cloud?"),
      validate: (value) =>
        value.trim().length > 0 ? true : "Enter a question to continue.",
    },
  ]);
  return question.trim();
}
