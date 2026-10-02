import { Command } from "commander";
import { registerAddCommand } from "./commands/add.js";
import { registerAskCommand } from "./commands/ask.js";
import { registerProvidersCommand } from "./commands/providers.js";
import { registerScanCommand } from "./commands/scan.js";
import { VERSION } from "./constants.js";

export function buildProgram() {
  const program = new Command();
  program
    .name("cloudmind")
    .description("Scan cloud resources and ask questions about them")
    .option("-p, --provider <provider>", "provider to use")
    .version(VERSION, "-V, --version", "output the version number")
    .showHelpAfterError();

  registerAddCommand(program);
  registerProvidersCommand(program);
  registerScanCommand(program);
  registerAskCommand(program);

  return program;
}
