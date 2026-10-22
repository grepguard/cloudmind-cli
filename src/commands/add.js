import chalk from "chalk";
import {
  getCredentials,
  getOpenAIKey,
  normalizeProvider,
  readConfig,
  writeConfig,
} from "../config.js";
import { printSaved } from "../output.js";
import { promptForProviderCredentials } from "../prompts.js";

export function registerAddCommand(program) {
  program
    .command("add <provider>")
    .description("Save a provider token on this computer")
    .action(async (provider) => {
      const normalizedProvider = normalizeProvider(provider);
      console.log(
        `\n${chalk.cyan("›")} ${chalk.bold(`Add provider "${normalizedProvider}"`)}\n`,
      );

      const config = await readConfig();
      if (normalizedProvider === "openai") {
        const existingKey = getOpenAIKey(config);
        const answers = await promptForProviderCredentials(
          "OpenAI",
          existingKey ? { token: existingKey } : undefined,
          "OpenAI API key:",
        );
        if (!answers) return;
        config.openai = { apiKey: answers.token.trim() };
        await writeConfig(config);
        printSaved("OpenAI");
        return;
      }

      config.providers ??= {};

      const answers = await promptForProviderCredentials(
        normalizedProvider,
        getCredentials(config, normalizedProvider),
      );
      if (!answers) return;

      config.providers[normalizedProvider] = {
        token: answers.token.trim(),
      };
      await writeConfig(config);
      printSaved(normalizedProvider);
    });
}
