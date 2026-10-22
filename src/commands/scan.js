import {
  readConfig,
  requireCredentials,
  requireProviderName,
} from "../config.js";
import { printScanResult } from "../output.js";
import { runDoScan } from "../providers/do/scan.js";

export function registerScanCommand(program) {
  program
    .command("scan")
    .description("Scan resources for a provider")
    .action(async () => {
      const provider = requireProviderName(program);
      const config = await readConfig();
      const credentials = requireCredentials(config, provider);
      if (provider !== "do") {
        throw new Error(`Provider "${provider}" is not supported yet.`);
      }
      const result = await runDoScan(credentials.token);
      printScanResult(provider, result);
    });
}
