"use strict";

const { buildConfig } = require("../../");
const { expect } = require("chai");
const { mergeConfig } = require("../utils/config");
const envVars = require("../utils/env-vars");

describe("Code-coverage config", () => {
  beforeEach(envVars.override);
  afterEach(envVars.restore);

  it("should not configure code coverage by default", () => {
    let config = buildConfig();
    expect(config.reporters).not.to.include("coverage-istanbul");
    expect(config).not.to.have.property("coverageIstanbulReporter");
    expect(config.webpack.module.rules).to.deep.equal([]);
  });

  it("should add code coverage config if specified", () => {
    let config = buildConfig({ coverage: true });

    expect(config).to.deep.equal(mergeConfig({
      reporters: [
        "verbose",
        "coverage-istanbul"
      ],
      webpack: {
        mode: "development",
        devtool: "inline-source-map",
        module: {
          rules: [
            {
              test: /\.jsx?$/,
              include: /src/,
              exclude: /node_modules|\.spec\.|\.test\./,
              enforce: "post",
              use: "coverage-istanbul-loader"
            }
          ],
        }
      },
      coverageIstanbulReporter: {
        dir: "coverage/%browser%",
        reports: ["text-summary", "lcov"],
      }
    }));
  });

  it("should not override user-specified code coverage settings", () => {
    let config = buildConfig({
      coverage: true,
      config: {
        webpack: {
          module: {
            rules: [
              {
                test: /src\/*\.*/,
                use: [
                  {
                    loader: "coverage-istanbul-loader",
                    options: {
                      compact: true,
                      esModules: false,
                    }
                  }
                ]
              }
            ],
          }
        },
        coverageIstanbulReporter: {
          reports: ["lcovonly"],
          combineBrowserReports: true,
        }
      }
    });

    expect(config).to.deep.equal(mergeConfig({
      reporters: [
        "verbose",
        "coverage-istanbul"
      ],
      webpack: {
        mode: "development",
        devtool: "inline-source-map",
        module: {
          rules: [
            {
              test: /src\/*\.*/,
              use: [
                {
                  loader: "coverage-istanbul-loader",
                  options: {
                    compact: true,
                    esModules: false,
                  }
                }
              ]
            }
          ],
        }
      },
      coverageIstanbulReporter: {
        dir: "coverage/%browser%",
        reports: ["lcovonly"],
        combineBrowserReports: true,
      }
    }));
  });

});
