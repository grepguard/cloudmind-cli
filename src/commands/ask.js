import { requestJson } from "../api.js";
import {
  readConfig,
  requireCredentials,
  requireProviderName,
} from "../config.js";
import { API_BASE_URL } from "../constants.js";
import { printAnswer } from "../output.js";
import { promptForQuestion } from "../prompts.js";

export function registerAskCommand(program) {
  program
    .command("ask [question]")
    .description("Ask a question about a provider's cloud resources")
    .action(async (question) => {
      const provider = requireProviderName(program);
      const prompt = question?.trim() || (await promptForQuestion());

      const config = await readConfig();
      const credentials = requireCredentials(config, provider);
      const result = await requestJson(
        `${API_BASE_URL}/ask`,
        credentials.token,
        {
          method: "POST",
          body: JSON.stringify({ provider, question: prompt }),
        },
      );
      printAnswer(provider, result);
    });
}
