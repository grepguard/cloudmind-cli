import {
  readConfig,
  requireCredentials,
  requireOpenAIKey,
  requireProviderName,
} from "../config.js";
import { answerQuestion } from "../openai.js";
import { printAnswer } from "../output.js";
import { promptForQuestion } from "../prompts.js";
import { runDoScan } from "../providers/do/scan.js";

export function registerAskCommand(program) {
  program
    .command("ask [question]")
    .description("Ask a question about a provider's cloud resources")
    .action(async (question) => {
      const provider = requireProviderName(program);
      const prompt = question?.trim() || (await promptForQuestion());

      const config = await readConfig();
      const credentials = requireCredentials(config, provider);
      if (provider !== "do") {
        throw new Error(`Provider "${provider}" is not supported yet.`);
      }
      const apiKey = requireOpenAIKey(config);
      const scan = await runDoScan(credentials.token);
      const result = await answerQuestion(apiKey, provider, prompt, scan);
      printAnswer(provider, result);
    });
}
