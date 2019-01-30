/**
 * Configures the browsers for the current platform
 */
export function configureBrowsers(config) {

  ///////////////////// TODO - Get process from env variable

  let isWindows = /^win/.test(process.platform) || process.env.WINDOWS === "true";
  let isMac = /^darwin/.test(process.platform);
  let isLinux = !isMac && !isWindows;
  let isCI = process.env.CI === "true";

  if (isCI) {
    if (isWindows) {
      // IE and Edge aren't available in CI, so use SauceLabs
      configureSauceLabs(config);
    }
    else if (isMac) {
      config.browsers = ["FirefoxHeadless", "ChromeHeadless", "Safari"];
    }
    else if (isLinux) {
      config.browsers = ["FirefoxHeadless", "ChromeHeadless"];
    }
  }
  else if (isMac) {
    config.browsers = ["Firefox", "Chrome", "Safari"];
  }
  else if (isLinux) {
    config.browsers = ["Firefox", "Chrome"];
  }
  else if (isWindows) {
    config.browsers = ["Firefox", "Chrome", "Edge"];
  }
}

/**
 * Configures Sauce Labs to test on IE and Edge.
 * https://github.com/karma-runner/karma-sauce-launcher
 */
function configureSauceLabs(config) {
  let username = process.env.SAUCE_USERNAME;
  let accessKey = process.env.SAUCE_ACCESS_KEY;

  if (!username || !accessKey) {
    throw new Error("SAUCE_USERNAME and/or SAUCE_ACCESS_KEY is not set");
  }

  let project = require("./package.json");

  config.sauceLabs = {
    build: `${project.name} v${project.version} Build #${process.env.TRAVIS_JOB_NUMBER}`,
    testName: `${project.name} v${project.version}`,
    tags: [project.name],
  };

  config.customLaunchers = {
    // IE_11: {
    //   base: "SauceLabs",
    //   platform: "Windows 7",
    //   browserName: "internet explorer"
    // },
    Edge: {
      base: "SauceLabs",
      platform: "Windows 10",
      browserName: "microsoftedge"
    },
  };

  config.reporters.push("saucelabs");
  config.browsers = Object.keys(config.customLaunchers);
  // config.concurrency = 1;
  config.captureTimeout = 60000;
  config.browserDisconnectTolerance = 5;
  config.browserDisconnectTimeout = 60000;
  config.browserNoActivityTimeout = 60000;
  config.logLevel = "debug";
}
