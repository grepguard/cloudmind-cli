import { readConfig } from "../config.js";
import { printProviders } from "../output.js";

export function registerProvidersCommand(program) {
  program
    .command("providers")
    .description("List configured providers")
    .action(async () => {
      const config = await readConfig();
      printProviders(config);
    });
}
