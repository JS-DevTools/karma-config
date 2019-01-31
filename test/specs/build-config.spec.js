"use strict";

const { buildConfig } = require("../../");
const { expect } = require("chai");
const { defaultConfig, mergeConfig } = require("../fixtures/config");
const envVars = require("../fixtures/env-vars");

describe("buildConfig()", () => {
  beforeEach(envVars.override);
  afterEach(envVars.restore);

  it("should return the default config if called with no options", () => {
    let config = buildConfig();
    expect(config).to.deep.equal(defaultConfig);
  });

  it("should not override user-specified config settings", () => {
    let config = buildConfig({
      config: {
        frameworks: ["my-framework"],
        reporters: ["my-reporter"],
        files: [],    // <--- empty array
      }
    });

    expect(config).to.deep.equal(mergeConfig({
      frameworks: ["my-framework"],
      reporters: ["my-reporter"],
      files: [],
    }));
  });

});
