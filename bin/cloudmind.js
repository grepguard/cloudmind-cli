#!/usr/bin/env node

import chalk from "chalk";
import { buildProgram } from "../src/program.js";

const program = buildProgram();

// Allow `-v` as an alias for `--version`.
process.argv = process.argv.map((argument, index) =>
  index >= 2 && argument === "-v" ? "--version" : argument,
);

await program.parseAsync().catch((error) => {
  console.error(chalk.red(`\nError: ${error.message}`));
  process.exitCode = 1;
});
