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
      expect(config.browsers).to.deep.equal(["Edge"]);
    }
    else if (process.platform === "darwin") {
      expect(config.browsers).to.deep.equal(["Safari"]);
    }
    else {
      expect(config.browsers).to.deep.equal(["Chrome", "Firefox"]);
    }
  });

  it("should only use supported browsers", () => {
    let config = buildConfig({
      browsers: {
        chrome: false,
        firefox: true,
        ie: true,
      }
    });

    if (process.platform === "win32") {
      expect(config.browsers).to.deep.equal(["Firefox", "Edge", "IE"]);
    }
    else if (process.platform === "darwin") {
      expect(config.browsers).to.deep.equal(["Firefox", "Safari", "IE"]);
    }
    else {
      expect(config.browsers).to.deep.equal(["Firefox", "IE"]);
    }
  });

  it("should prefer headless browsers in CI", () => {
    let config = buildConfig({
      CI: true,
      browsers: {
        chrome: true,
        firefox: true,
        ie: true,
      }
    });

    if (process.platform === "win32") {
      expect(config.browsers).to.deep.equal(["ChromeHeadless", "FirefoxHeadless", "Edge", "IE"]);
    }
    else if (process.platform === "darwin") {
      expect(config.browsers).to.deep.equal(["ChromeHeadless", "FirefoxHeadless", "Safari", "IE"]);
    }
    else {
      expect(config.browsers).to.deep.equal(["ChromeHeadless", "FirefoxHeadless", "IE"]);
    }
  });

  it("should not use SauceLabs if credentials don't exist", () => {
    let config = buildConfig({
      platform: "linux",
      browsers: {
        safari: true,
        edge: true,
        ie: true,
      }
    });

    expect(config.browsers).to.deep.equal(["Chrome", "Firefox", "Safari", "Edge", "IE"]);
    expect(config).not.to.have.property("sauceLabs");
    expect(config).not.to.have.property("customLaunchers");
  });

  it("should not use SauceLabs on Linux by default", () => {
    process.env.SAUCE_USERNAME = "my-username";
    process.env.SAUCE_ACCESS_KEY = "my-access-key";
    process.env.CI_BUILD_NUMBER = "1.23";

    let config = buildConfig({
      platform: "linux",
    });

    expect(config).to.deep.equal(mergeConfig({
      reporters: ["verbose"],
      browsers: ["Chrome", "Firefox"],
    }));
  });

  it("should prefer SauceLabs on Linux", () => {
    process.env.SAUCE_USERNAME = "my-username";
    process.env.SAUCE_ACCESS_KEY = "my-access-key";
    process.env.CI_BUILD_NUMBER = "1.23";

    let config = buildConfig({
      platform: "linux",
      browsers: {
        safari: true,
        edge: true,
      }
    });

    expect(config).to.deep.equal(mergeConfig({
      reporters: ["verbose", "saucelabs"],
      browsers: ["Chrome", "Firefox", "Safari_SauceLabs", "Edge_SauceLabs"],
      logLevel: "debug",
      captureTimeout: 60000,
      browserDisconnectTolerance: 5,
      browserDisconnectTimeout: 60000,
      browserNoActivityTimeout: 60000,
      sauceLabs: {
        build: `@jsdevtools/karma-config v${pkg.version} Build #1.23`,
        testName: `@jsdevtools/karma-config v${pkg.version}`,
        tags: ["@jsdevtools/karma-config"],
      },
      customLaunchers: {
        /* eslint-disable camelcase */
        Safari_SauceLabs: {
          base: "SauceLabs",
          platform: "MacOS 10.15",
          browserName: "safari",
        },
        Edge_SauceLabs: {
          base: "SauceLabs",
          platform: "Windows 10",
          browserName: "microsoftedge",
        },
      }
    }));
  });

  it("should use headless browsers and SauceLabs on Linux CI", () => {
    process.env.SAUCE_USERNAME = "my-username";
    process.env.SAUCE_ACCESS_KEY = "my-access-key";
    process.env.CI_BUILD_NUMBER = "1.23";

    let config = buildConfig({
      CI: true,
      platform: "linux",
      browsers: {
        ie: true,
        safari: true,
      }
    });

    expect(config).to.deep.equal(mergeConfig({
      reporters: ["verbose", "saucelabs"],
      browsers: ["ChromeHeadless", "FirefoxHeadless", "Safari_SauceLabs", "IE_SauceLabs"],
      logLevel: "debug",
      captureTimeout: 60000,
      browserDisconnectTolerance: 5,
      browserDisconnectTimeout: 60000,
      browserNoActivityTimeout: 60000,
      sauceLabs: {
        build: `@jsdevtools/karma-config v${pkg.version} Build #1.23`,
        testName: `@jsdevtools/karma-config v${pkg.version}`,
        tags: ["@jsdevtools/karma-config"],
      },
      customLaunchers: {
        /* eslint-disable camelcase */
        Safari_SauceLabs: {
          base: "SauceLabs",
          platform: "MacOS 10.15",
          browserName: "safari",
        },
        IE_SauceLabs: {
          base: "SauceLabs",
          platform: "Windows 10",
          browserName: "internet explorer",
        },
      },
      webpack: {
        mode: "development",
        devtool: "inline-source-map",
        module: {
          rules: [
            {
              test: /\.(js|jsx|mjs)$/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: ["@babel/preset-env"]
                }
              }
            }
          ]
        }
      }
    }));
  });

});
