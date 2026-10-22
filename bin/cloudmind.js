#!/usr/bin/env node

import chalk from "chalk";
import { buildProgram } from "../src/program.js";

const program = buildProgram();

await program.parseAsync().catch((error) => {
  console.error(chalk.red(`\nError: ${error.message}`));
  process.exitCode = 1;
});
