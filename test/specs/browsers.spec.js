"use strict";

const { buildConfig } = require("../../");
const { expect } = require("chai");
const { compareConfig } = require("../utils/config");
const pkg = require("../../package.json");

describe("Browser config", () => {

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
});
