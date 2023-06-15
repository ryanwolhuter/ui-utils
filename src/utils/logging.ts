import chalk from "chalk";

export function logError(e: string) {
  return console.log(chalk.red(e));
}

export function logSuccess(e: string) {
  return console.log(chalk.green(e));
}

export function handleError(e: string) {
  logError(`Error: ${e}`);
  process.exit(1);
}
