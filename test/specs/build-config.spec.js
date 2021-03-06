"use strict";

const { buildConfig } = require("../../");
const { expect } = require("chai");
const { defaultConfig, defaultPlugins, compareConfig } = require("../utils/config");

describe("buildConfig()", () => {

  it("should return the default config if called with no options", () => {
    let config = buildConfig();
    expect(config).to.satisfy(compareConfig(defaultConfig));
  });

  it("should not override user-specified config settings", () => {
    let config = buildConfig({
      config: {
        plugins: ["my-plugin"],
        frameworks: ["my-framework"],
        reporters: ["my-reporter"],
        files: [],    // <--- empty array
      }
    });

    expect(config).to.satisfy(compareConfig({
      plugins: [
        "my-plugin",
        ...defaultPlugins,
      ],
      frameworks: ["my-framework"],
      reporters: ["my-reporter"],
      files: [],
    }));
  });

  it("should serve a single file", () => {
    let config = buildConfig({ serve: "path/to/my/file.json" });

    expect(config).to.satisfy(compareConfig({
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

    expect(config).to.satisfy(compareConfig({
      files: [
        "test/**/*.+(spec|test).+(js|jsx|mjs)",
        { pattern: "path/to/some/**/*.files", included: false, served: true },
        { pattern: "more/**/*.files", served: true },
      ],
    }));
  });

  it("should load test fixtures before tests", () => {
    let config = buildConfig({ fixtures: "path/to/my/test/fixtures.js" });

    expect(config).to.satisfy(compareConfig({
      files: [
        "path/to/my/test/fixtures.js",
        "test/**/*.+(spec|test).+(js|jsx|mjs)",
        { pattern: "test/**/*", included: false, served: true },
      ],
      preprocessors: {
        "path/to/my/test/fixtures.js": ["webpack"],
        "test/**/*.+(spec|test).+(js|jsx|mjs)": ["webpack"],
      },
    }));
  });

  it("should load multiple test fixtures before tests", () => {
    let config = buildConfig({
      fixtures: [
        "path/to/my/test/fixtures.js",
        { pattern: "more/test/fixtures.mjs" },
        { pattern: "more/test/fixtures.mjs", included: false, served: true },
      ]
    });

    expect(config).to.satisfy(compareConfig({
      files: [
        "path/to/my/test/fixtures.js",
        { pattern: "more/test/fixtures.mjs" },
        { pattern: "more/test/fixtures.mjs", included: false, served: true },
        "test/**/*.+(spec|test).+(js|jsx|mjs)",
        { pattern: "test/**/*", included: false, served: true },
      ],
      preprocessors: {
        "more/test/fixtures.mjs": ["webpack"],
        "path/to/my/test/fixtures.js": ["webpack"],
        "test/**/*.+(spec|test).+(js|jsx|mjs)": ["webpack"],
      },
    }));
  });

});
