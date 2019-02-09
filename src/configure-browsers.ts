import { ConfigOptions } from "karma";
import { NormalizedOptions } from "./normalize-options";
import { readPackageJson } from "./package-json";
import { mergeConfig } from "./util";

/**
 * Configures the browsers for the current platform
 */
export function configureBrowsers(config: ConfigOptions, options: NormalizedOptions): ConfigOptions {
  if (config.browsers) {
    // The user has already specified the browsers
    return config;
  }

  let { windows, mac, CI, browsers: { chrome, firefox, safari, edge, ie }} = options;
  let browsers = config.browsers = [] as string[];

  if (CI) {
    if (windows) {
      // Windows browsers aren't available in many CI systems, so try using SauceLabs
      config = configureSauceLabs(config, options);
      browsers = config.browsers!;

      if (browsers.length === 0) {
        chrome && browsers.push("ChromeHeadless");
        firefox && browsers.push("FirefoxHeadless");
        edge && browsers.push("Edge");
        ie && browsers.push("IE");
      }
    }
    else {
      chrome && browsers.push("ChromeHeadless");
      firefox && browsers.push("FirefoxHeadless");
      mac && safari && browsers.push("Safari");
    }
  }
  else {
    chrome && browsers.push("Chrome");
    firefox && browsers.push("Firefox");
    mac && safari && browsers.push("Safari");
    windows && edge && browsers.push("Edge");
    windows && ie && browsers.push("IE");
  }

  return config;
}

/**
 * Configures Karma to use Sauce Labs for Windows browser testing.
 * Returns `false` if Sauce Labs credentials are not present.
 *
 * @see https://github.com/karma-runner/karma-sauce-launcher
 */
function configureSauceLabs(config: ConfigOptions, options: NormalizedOptions): ConfigOptions {
  let { browsers: { chrome, firefox, edge, ie }} = options;
  let browsers = config.browsers!;
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

  config.customLaunchers = config.customLaunchers || {};

  if (chrome) {
    browsers.push("Chrome_SauceLabs");
    config.customLaunchers.Chrome_SauceLabs = {
      base: "SauceLabs",
      platform: "Windows 10",
      browserName: "chrome",
    };
  }

  if (firefox) {
    browsers.push("Firefox_SauceLabs");
    config.customLaunchers.Firefox_SauceLabs = {
      base: "SauceLabs",
      platform: "Windows 10",
      browserName: "firefox",
    };
  }

  if (edge) {
    browsers.push("Edge_SauceLabs");
    config.customLaunchers.Edge_SauceLabs = {
      base: "SauceLabs",
      platform: "Windows 10",
      browserName: "microsoftedge",
    };
  }

  if (ie) {
    browsers.push("IE_SauceLabs");
    config.customLaunchers.IE_SauceLabs = {
      base: "SauceLabs",
      platform: "Windows 10",
      browserName: "internet explorer"
    };
  }

  return config;
}
