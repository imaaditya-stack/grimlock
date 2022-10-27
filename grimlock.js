/**
BOT: GrimLock
SOLE PURPOSE: Regularize attendance in EasyHR
USAGE: Add credentials in env.js and just run the script and enjoy!
**/

const puppeteer = require("puppeteer");
const { GREET_MESSAGES, BRAGGING_MESSAGES } = require("./constants");
const ENV = require("./env");
const logger = require("./logger");
const { getDateInRequiredFormat, getRandomItem } = require("./utils");

async function initBrowser() {
  // Use below config to see the process in action

  // const browser = await puppeteer.launch({
  //   headless: false,
  //   args: ["--start-maximized"],
  //   defaultViewport: null,
  // });
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  return page;
}

async function interceptNetworkRequests(page) {
  await page.setRequestInterception(true);

  page.on("request", (request) => {
    request.continue();
  });

  page.on("response", async (response) => {
    if (
      response.url() ===
      "https://v2stech.easyhrworld.com/attendance/rationalize_attendance_request"
    ) {
      if (response.ok()) {
        logger.success(
          "Woah Laa Woah!!!! Successfully Rationalized Attendance Request :)"
        );
      } else {
        logger.error("Oops, Failed to Rationalize Attendance Request :(");
        logger.error("Response: ", await response.json());
      }
    }
  });
}

async function authenticationHandler(page) {
  await page.goto(`https://v2stech.easyhrworld.com/employee`);
  await page.type("#username", ENV.USERNAME);
  await page.type("#password", ENV.PASSWORD);
  logger.info("Got your credentials, Logging into EasyHR!");
  await page.keyboard.press("Enter");
}

async function navigateToMyAttendancePage(page) {
  await page.waitForNavigation();
  await page.goto(`https://v2stech.easyhrworld.com/attendance/my_attendance`, {
    waitUntil: "load",
    timeout: 0,
  });
  await page.waitForTimeout(5000);
  logger.info(`I'm on it buddy, ${getRandomItem(BRAGGING_MESSAGES)}`);
  await page.waitForTimeout(1000);
}

async function rationalizeAttendance(page) {
  const dateInRequiredFormat = getDateInRequiredFormat();
  if (!dateInRequiredFormat) {
    logger.error(`Oops, Something Went Wrong, Try Again!`);
    return;
  }
  const element = await page.$(`[data-date="${dateInRequiredFormat}"]`);
  await page.evaluate((element) => element.click(), element);
  logger.info(
    `Raising Rationalize Attendance Request for {${dateInRequiredFormat}}`
  );
  await page
    .waitForSelector("#reason", { visible: true, timeout: 3000 })
    .catch((e) => {
      logger.info("Oops, Request has already been sent for Approval!");
      process.exit(1);
    });
  await page.focus("#reason");
  await page.type("#reason", ENV.REQUEST_REASON);
  await page.waitForTimeout(1000);
  const applyButton = await page.$(`#btnapply`);
  await page.evaluate((element) => element.click(), applyButton);
}

async function runBot() {
  const page = await initBrowser();
  const greetingMessage = `${getRandomItem(
    GREET_MESSAGES
  )}, Sit back and relax, M doin the boring job for you!`.replace(
    "{user}",
    ENV.NAME
  );
  logger.info(greetingMessage);
  await interceptNetworkRequests(page);
  await authenticationHandler(page);
  await navigateToMyAttendancePage(page);
  await rationalizeAttendance(page);
}

runBot();
