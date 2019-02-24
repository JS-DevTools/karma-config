"use strict";

const { buildConfig } = require("../../");
const { expect } = require("chai");
const { defaultConfig, mergeConfig } = require("../utils/config");
const envVars = require("../utils/env-vars");

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

  it("should serve a single file", () => {
    let config = buildConfig({ serve: "path/to/my/file.json" });

    expect(config).to.deep.equal(mergeConfig({
      files: [
        "test/**/*.+(spec|test).+(js|jsx|mjs)",
        { pattern: "path/to/my/file.json", included: false, served: true }
      ],
    }));
  });

  it("should serve multiple files", () => {
    let config = buildConfig({
      serve: [
        "path/to/some/**/*.files",
        { pattern: "more/**/*.files" }
      ],
    });

    expect(config).to.deep.equal(mergeConfig({
      files: [
        "test/**/*.+(spec|test).+(js|jsx|mjs)",
        { pattern: "path/to/some/**/*.files", included: false, served: true },
        { pattern: "more/**/*.files", served: true },
      ],
    }));
  });

  it("should load test fixtures before tests", () => {
    let config = buildConfig({ fixtures: "path/to/my/test/fixtures.js" });

    expect(config).to.deep.equal(mergeConfig({
      files: [
        "path/to/my/test/fixtures.js",
        "test/**/*.+(spec|test).+(js|jsx|mjs)",
        { pattern: "test/**/*", included: false, served: true },
      ],
    }));
  });

  it("should load multiple test fixtures before tests", () => {
    let config = buildConfig({
      fixtures: [
        "path/to/my/test/fixtures.js",
        { pattern: "more/test/fixtures.mjs" },
      ]
    });

    expect(config).to.deep.equal(mergeConfig({
      files: [
        "path/to/my/test/fixtures.js",
        { pattern: "more/test/fixtures.mjs" },
        "test/**/*.+(spec|test).+(js|jsx|mjs)",
        { pattern: "test/**/*", included: false, served: true },
      ],
    }));
  });

});
