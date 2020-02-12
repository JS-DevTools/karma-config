import { ConfigOptions } from "karma";
import { NormalizedOptions } from "./normalize-options";
import { readPackageJson } from "./package-json";
import { addPlugin, mergeConfig } from "./util";

/**
 * Configures the browsers for the current platform
 */
export function configureBrowsers(config: ConfigOptions, options: NormalizedOptions): ConfigOptions {
  if (config.browsers) {
    // The user has already specified the browsers
    return config;
  }

  let { CI, browsers: { chrome, firefox, safari, edge, ie }} = options;
  let browsers = config.browsers = [] as string[];

  chrome && addPlugin(config, "karma-chrome-launcher");
  firefox && addPlugin(config, "karma-firefox-launcher");
  safari && addPlugin(config, "karma-safari-launcher");
  edge && addPlugin(config, "karma-edge-launcher");
  ie && addPlugin(config, "karma-ie-launcher");

  if (CI) {
    chrome && browsers.push("ChromeHeadless");
    firefox && browsers.push("FirefoxHeadless");
  }
  else {
    chrome && browsers.push("Chrome");
    firefox && browsers.push("Firefox");
  }

  if (canRunSauceConnect(options)) {
    configureSauceLabs(config, options);
  }
  else {
    safari && browsers.push("Safari");
    edge && browsers.push("Edge");
    ie && browsers.push("IE");
  }

  return config;
}

/**
 * Determines whether the system meets the requirements for running the Sauce Connect proxy.
 *
 * @see https://github.com/karma-runner/karma-sauce-launcher
 */
function canRunSauceConnect(options: NormalizedOptions): boolean {
  let username = process.env.SAUCE_USERNAME;
  let accessKey = process.env.SAUCE_ACCESS_KEY;

  return Boolean(options.linux && username && accessKey);
}

/**
 * Configures Karma to use Sauce Labs for Windows browser testing.
 * Returns `false` if Sauce Labs credentials are not present.
 *
 * @see https://github.com/karma-runner/karma-sauce-launcher
 */
function configureSauceLabs(config: ConfigOptions, options: NormalizedOptions): ConfigOptions {
  let { browsers: { safari, edge, ie }} = options;
  let browsers = config.browsers!;

  if (!(safari || edge || ie)) {
    // No need to run tests on Sauce Labs
    return config;
  }

  addPlugin(config, "karma-sauce-launcher");

  let buildNumber =
    process.env.BUILD_NUMBER ||
    process.env.BUILD_TAG ||
    process.env.CI_BUILD_NUMBER ||
    process.env.CI_BUILD_TAG ||
    process.env.TRAVIS_BUILD_NUMBER ||
    process.env.CIRCLE_BUILD_NUM ||
    process.env.DRONE_BUILD_NUMBER ||
    process.env.GITHUB_RUN_NUMBER ||
    Date.now();

  let pkg = readPackageJson();

  config.reporters!.push("saucelabs");

  config = mergeConfig(config, {
    logLevel: "debug",
    // concurrency: 1,
    captureTimeout: 60000,
    browserDisconnectTolerance: 5,
    browserDisconnectTimeout: 60000,
    browserNoActivityTimeout: 60000,
  });

  config.sauceLabs = mergeConfig(config.sauceLabs, {
    build: `${pkg.name} v${pkg.version} Build #${buildNumber}`,
    testName: `${pkg.name} v${pkg.version}`,
    tags: [pkg.name],
  });

  config.customLaunchers = config.customLaunchers || {};

  if (safari) {
    browsers.push("Safari_SauceLabs");
    config.customLaunchers.Safari_SauceLabs = mergeConfig(config.customLaunchers.Safari_SauceLabs, {
      base: "SauceLabs",
      platform: "MacOS 10.15",  // Catalina
      browserName: "safari",
    });
  }

  if (edge) {
    browsers.push("Edge_SauceLabs");
    config.customLaunchers.Edge_SauceLabs = mergeConfig(config.customLaunchers.Edge_SauceLabs, {
      base: "SauceLabs",
      platform: "Windows 10",
      browserName: "microsoftedge",
      version: "18.17763",    // The last version of EdgeHTML, before the switch to Chromium
    });
  }

  if (ie) {
    browsers.push("IE_SauceLabs");
    config.customLaunchers.IE_SauceLabs = mergeConfig(config.customLaunchers.IE_SauceLabs, {
      base: "SauceLabs",
      platform: "Windows 10",
      browserName: "internet explorer"
    });
  }

  return config;
}
