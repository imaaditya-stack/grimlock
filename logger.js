const chalk = require("chalk");
const { getRandomItem } = require("./utils");

const colors = [
  "yellowBright",
  "blueBright",
  "magentaBright",
  "cyanBright",
  "whiteBright",
];

module.exports = {
  error: (message) => {
    message && console.log(chalk.redBright(`<<<<<<<< ${message} >>>>>>>>`));
  },
  success: (message) => {
    message && console.log(chalk.greenBright(`<<<<<<<< ${message} >>>>>>>>`));
  },
  info: (message) => {
    message &&
      console.log(chalk[getRandomItem(colors)](`<<<<<<<< ${message} >>>>>>>>`));
  },
};
