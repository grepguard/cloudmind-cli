import { requestJson } from "../api.js";
import {
  readConfig,
  requireCredentials,
  requireProviderName,
} from "../config.js";
import { API_BASE_URL } from "../constants.js";
import { printScanResult } from "../output.js";

export function registerScanCommand(program) {
  program
    .command("scan")
    .description("Scan resources for a provider")
    .action(async () => {
      const provider = requireProviderName(program);
      const config = await readConfig();
      const credentials = requireCredentials(config, provider);
      const result = await requestJson(
        `${API_BASE_URL}/${provider}/scan`,
        credentials.token,
      );
      printScanResult(provider, result);
    });
}
