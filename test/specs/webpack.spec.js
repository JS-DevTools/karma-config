"use strict";

const { buildConfig } = require("../../");
const { expect } = require("chai");
const { mergeConfig } = require("../utils/config");
const envVars = require("../utils/env-vars");

describe("webpack config", () => {
  beforeEach(envVars.override);
  afterEach(envVars.restore);

  it("should configure webpack by default", () => {
    let config = buildConfig();

    expect(config).to.deep.equal(mergeConfig({
      preprocessors: {
        "test/**/*.+(spec|test).+(js|jsx|mjs)": ["webpack"],
      },
      webpack: {
        mode: "development",
        devtool: "inline-source-map",
        module: {
          rules: [],
        }
      }
    }));
  });

  it("should not override user-specified webpack config settings", () => {
    let config = buildConfig({
      config: {
        webpack: {
          mode: "production",
          devtool: "",     // <--- empty string
          module: {
            foo: "bar",
          }
        },
      }
    });

    expect(config).to.deep.equal(mergeConfig({
      webpack: {
        mode: "production",
        devtool: "",
        module: {
          foo: "bar",
          rules: [],
        }
      }
    }));
  });

  it("should not override user-specified webpack rules", () => {
    let config = buildConfig({
      config: {
        webpack: {
          module: {
            rules: [
              { some: "rule" }
            ]
          }
        },
      }
    });

    expect(config).to.deep.equal(mergeConfig({
      webpack: {
        mode: "development",
        devtool: "inline-source-map",
        module: {
          rules: [
            { some: "rule" }
          ],
        }
      }
    }));
  });

});
