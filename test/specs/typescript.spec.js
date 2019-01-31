"use strict";

const { buildConfig } = require("../../");
const { expect } = require("chai");
const { mergeConfig } = require("../fixtures/config");
const envVars = require("../fixtures/env-vars");

describe("TypeScript config", () => {
  beforeEach(envVars.override);
  afterEach(envVars.restore);

  it("should not configure typescript by default", () => {
    let config = buildConfig();

    expect(config).not.to.have.property("mime");
    expect(config.webpack).not.to.have.property("resolve");
    expect(config.webpack.module.rules).to.deep.equal([]);
  });

  it("should configure TypeScript settings", () => {
    let config = buildConfig({ typescript: true });

    expect(config).to.deep.equal(mergeConfig({
      mime: {
        "text/x-typescript": ["ts", "tsx"]
      },
      webpack: {
        mode: "development",
        devtool: "inline-source-map",
        resolve: {
          extensions: [".js", ".jsx", ".mjs", ".json", ".ts", ".tsx"]
        },
        module: {
          rules: [
            { test: /\.tsx?$/, use: "ts-loader" }
          ]
        }
      }
    }));
  });

  it("should not override user-specified TypeScript config settings", () => {
    let config = buildConfig({
      typescript: true,
      config: {
        mime: {
          "text/x-typescript": ["zzz"]
        },
        webpack: {
          resolve: {
            extensions: [".zzz"]
          },
          module: {
            rules: [
              { test: /zzz$/, use: "ts-loader" }
            ]
          }
        }
      }
    });

    expect(config).to.deep.equal(mergeConfig({
      mime: {
        "text/x-typescript": ["zzz"]
      },
      webpack: {
        mode: "development",
        devtool: "inline-source-map",
        resolve: {
          extensions: [".zzz", ".ts", ".tsx"]
        },
        module: {
          rules: [
            { test: /zzz$/, use: "ts-loader" }
          ]
        }
      }
    }));
  });

});
