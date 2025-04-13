import chalk from 'chalk';

export const logInfo = (...msgs: any[]) => console.log(chalk.blue(`\n🛈 INFO:`, ...msgs));

export const logSuccess = (...msgs: any[]) => console.log(chalk.green(`✔ SUCCESS:`, ...msgs));

export const logWarn = (...msgs: any[]) => console.log(chalk.yellow(`⚠ WARNING:`, ...msgs));

export const logError = (...msgs: any[]) => console.log(chalk.red(`✖ ERROR:`, ...msgs));
