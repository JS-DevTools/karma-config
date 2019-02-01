import { ConfigOptions } from "karma";
import { NormalizedOptions } from "./options";
import { readPackageJson } from "./package-json";
import { mergeConfig } from "./util";

/**
 * Configures the browsers for the current platform
 */
export function configureBrowsers(config: ConfigOptions, { windows, mac, linux, CI }: NormalizedOptions): ConfigOptions {
  if (config.browsers) {
    // The user has already specified the browsers
    return config;
  }

  if (CI) {
    if (windows) {
      // Windows browsers aren't available in many CI systems, so try using SauceLabs
      config = configureSauceLabs(config);

      if (!config.browsers) {
        config.browsers = ["FirefoxHeadless", "ChromeHeadless", "Edge"];
      }
    }
    else if (mac) {
      config.browsers = ["FirefoxHeadless", "ChromeHeadless", "Safari"];
    }
    else if (linux) {
      config.browsers = ["FirefoxHeadless", "ChromeHeadless"];
    }
  }
  else if (mac) {
    config.browsers = ["Firefox", "Chrome", "Safari"];
  }
  else if (linux) {
    config.browsers = ["Firefox", "Chrome"];
  }
  else if (windows) {
    config.browsers = ["Firefox", "Chrome", "Edge"];
  }

  return config;
}

/**
 * Configures Karma to use Sauce Labs for Windows browser testing.
 * Returns `false` if Sauce Labs credentials are not present.
 *
 * @see https://github.com/karma-runner/karma-sauce-launcher
 */
function configureSauceLabs(config: ConfigOptions): ConfigOptions {
  let username = process.env.SAUCE_USERNAME;
  let accessKey = process.env.SAUCE_ACCESS_KEY;

  if (!username || !accessKey) {
    return config;
  }

  let buildNumber =
    process.env.BUILD_NUMBER ||
    process.env.BUILD_TAG ||
    process.env.CI_BUILD_NUMBER ||
    process.env.CI_BUILD_TAG ||
    process.env.TRAVIS_BUILD_NUMBER ||
    process.env.CIRCLE_BUILD_NUM ||
    process.env.DRONE_BUILD_NUMBER;

  let pkg = readPackageJson();

  config.reporters!.push("saucelabs");

  config = mergeConfig(config, {
    browsers: ["Firefox_SauceLabs", "Chrome_SauceLabs", "Edge_SauceLabs"],
    logLevel: "debug",
    concurrency: 3,
    captureTimeout: 60000,
    browserDisconnectTolerance: 5,
    browserDisconnectTimeout: 60000,
    browserNoActivityTimeout: 60000,
  });

  config.sauceLabs = mergeConfig(config.sauceLabs, {
    build: `${pkg.name} v${pkg.version} Build #${buildNumber}`,
    testName: `${pkg.name} v${pkg.version}`,
    tags: [pkg.name!],
  });

  config.customLaunchers = mergeConfig(config.customLaunchers, {
    Firefox_SauceLabs: {
      base: "SauceLabs",
      platform: "Windows 10",
      browserName: "firefox",
    },
    Chrome_SauceLabs: {
      base: "SauceLabs",
      platform: "Windows 10",
      browserName: "chrome",
    },
    Edge_SauceLabs: {
      base: "SauceLabs",
      platform: "Windows 10",
      browserName: "microsoftedge",
    },
  });

  return config;
}
