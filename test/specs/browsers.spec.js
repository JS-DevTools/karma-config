"use strict";

const { buildConfig } = require("../../");
const { expect } = require("chai");
const { mergeConfig } = require("../utils/config");
const envVars = require("../utils/env-vars");
const pkg = require("../../package.json");

describe("Browser config", () => {
  beforeEach(envVars.override);
  afterEach(envVars.restore);

  it("should not override browsers that are specified by the user", () => {
    let config = buildConfig({
      config: {
        browsers: ["Opera"]
      }
    });

    expect(config.browsers).to.deep.equal(["Opera"]);
  });

  it("should use sensible default browsers per platform", () => {
    let config = buildConfig();

    if (process.platform === "win32") {
      expect(config.browsers).to.deep.equal(["Chrome", "Firefox", "Edge"]);
    }
    else if (process.platform === "darwin") {
      expect(config.browsers).to.deep.equal(["Chrome", "Firefox", "Safari"]);
    }
    else {
      expect(config.browsers).to.deep.equal(["Chrome", "Firefox"]);
    }
  });

  it("should only use supported browsers", () => {
    let config = buildConfig({
      browsers: {
        chrome: false,
        ie: true,
      }
    });

    if (process.platform === "win32") {
      expect(config.browsers).to.deep.equal(["Firefox", "Edge", "IE"]);
    }
    else if (process.platform === "darwin") {
      expect(config.browsers).to.deep.equal(["Firefox", "Safari"]);
    }
    else {
      expect(config.browsers).to.deep.equal(["Firefox"]);
    }
  });

  it("should prefer headless browsers in CI", () => {
    let config = buildConfig({ CI: true });

    if (process.platform === "win32") {
      expect(config.browsers).to.deep.equal(["ChromeHeadless", "FirefoxHeadless", "Edge"]);
    }
    else if (process.platform === "darwin") {
      expect(config.browsers).to.deep.equal(["ChromeHeadless", "FirefoxHeadless", "Safari"]);
    }
    else {
      expect(config.browsers).to.deep.equal(["ChromeHeadless", "FirefoxHeadless"]);
    }
  });

  it("should prefer headless versions of supported browsers in CI", () => {
    let config = buildConfig({
      CI: true,
      browsers: {
        ie: true,
        safari: false,
      }
    });

    if (process.platform === "win32") {
      expect(config.browsers).to.deep.equal(["ChromeHeadless", "FirefoxHeadless", "Edge", "IE"]);
    }
    else if (process.platform === "darwin") {
      expect(config.browsers).to.deep.equal(["ChromeHeadless", "FirefoxHeadless"]);
    }
    else {
      expect(config.browsers).to.deep.equal(["ChromeHeadless", "FirefoxHeadless"]);
    }
  });

  it("should prefer SauceLabs on Windows CI", () => {
    process.env.SAUCE_USERNAME = "my-username";
    process.env.SAUCE_ACCESS_KEY = "my-access-key";
    process.env.CI_BUILD_NUMBER = "1.23";

    let config = buildConfig({
      CI: true,
      platform: "windows"
    });

    expect(config).to.deep.equal(mergeConfig({
      reporters: ["verbose", "saucelabs"],
      browsers: ["Chrome_SauceLabs", "Firefox_SauceLabs", "Edge_SauceLabs"],
      logLevel: "debug",
      captureTimeout: 60000,
      browserDisconnectTolerance: 5,
      browserDisconnectTimeout: 60000,
      browserNoActivityTimeout: 60000,
      sauceLabs: {
        build: `karma-config v${pkg.version} Build #1.23`,
        testName: `karma-config v${pkg.version}`,
        tags: ["karma-config"],
      },
      customLaunchers: {
        /* eslint-disable camelcase */
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
      }
    }));
  });

  it("should use supported browsers in SauceLabs on Windows CI", () => {
    process.env.SAUCE_USERNAME = "my-username";
    process.env.SAUCE_ACCESS_KEY = "my-access-key";
    process.env.CI_BUILD_NUMBER = "1.23";

    let config = buildConfig({
      CI: true,
      platform: "windows",
      browsers: {
        ie: true,
        firefox: false,
      }
    });

    expect(config).to.deep.equal(mergeConfig({
      reporters: ["verbose", "saucelabs"],
      browsers: ["Chrome_SauceLabs", "Edge_SauceLabs", "IE_SauceLabs"],
      logLevel: "debug",
      captureTimeout: 60000,
      browserDisconnectTolerance: 5,
      browserDisconnectTimeout: 60000,
      browserNoActivityTimeout: 60000,
      sauceLabs: {
        build: `karma-config v${pkg.version} Build #1.23`,
        testName: `karma-config v${pkg.version}`,
        tags: ["karma-config"],
      },
      customLaunchers: {
        /* eslint-disable camelcase */
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
        IE_SauceLabs: {
          base: "SauceLabs",
          platform: "Windows 10",
          browserName: "internet explorer",
        },
      }
    }));
  });

  it("should not use SauceLabs on Windows CI if credentials don't exist", () => {
    let config = buildConfig({
      CI: true,
      platform: "windows"
    });

    expect(config.browsers).to.deep.equal(["ChromeHeadless", "FirefoxHeadless", "Edge"]);
    expect(config).not.to.have.property("sauceLabs");
    expect(config).not.to.have.property("customLaunchers");
  });

});
