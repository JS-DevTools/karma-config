"use strict";

const { buildConfig } = require("../../");
const { expect } = require("chai");
const { defaultPlugins, compareConfig } = require("../utils/config");

describe("Code-coverage config", () => {

  it("should not configure code coverage by default", () => {
    let config = buildConfig();
    expect(config.reporters).not.to.include("coverage-istanbul");
    expect(config).not.to.have.property("coverageIstanbulReporter");
    expect(config.webpack.module.rules).to.deep.equal([]);
  });

  it("should add code coverage config if specified", () => {
    let config = buildConfig({ coverage: true });

    expect(config).to.satisfy(compareConfig({
      plugins: [
        ...defaultPlugins,
        "reporter:coverage-istanbul",
      ],
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
              test: /\.(js|jsx|mjs)$/,
              include: /src/,
              exclude: /node_modules|\.spec\.|\.test\./,
              enforce: "post",
              use: "@jsdevtools/coverage-istanbul-loader"
            }
          ],
        }
      },
      coverageIstanbulReporter: {
        dir: "coverage/%browser%",
        reports: ["text-summary", "lcov"],
        skipFilesWithNoCoverage: true,
      }
    }));
  });

  it("should not override user-specified code coverage settings", () => {
    let config = buildConfig({
      coverage: true,
      config: {
        reporters: ["coverage-istanbul"],
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
          skipFilesWithNoCoverage: false,
        }
      }
    });

    expect(config).to.satisfy(compareConfig({
      plugins: [
        ...defaultPlugins,
        "reporter:coverage-istanbul",
      ],
      reporters: [
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
        skipFilesWithNoCoverage: false,
      }
    }));
  });

  it("should not override add coverage-istanbul-loader if the user alread added it", () => {
    let config = buildConfig({
      coverage: true,
      config: {
        webpack: {
          module: {
            rules: [
              {
                test: /\.ts$/,
                use: "ts-loader",
              },
              {
                test: /src\/*\.*/,
                use: "@jsdevtools/coverage-istanbul-loader"
              }
            ],
          }
        },
      }
    });

    expect(config).to.satisfy(compareConfig({
      plugins: [
        ...defaultPlugins,
        "reporter:coverage-istanbul",
      ],
      reporters: ["verbose", "coverage-istanbul"],
      webpack: {
        mode: "development",
        devtool: "inline-source-map",
        module: {
          rules: [
            {
              test: /\.ts$/,
              use: "ts-loader",
            },
            {
              test: /src\/*\.*/,
              use: "@jsdevtools/coverage-istanbul-loader"
            }
          ],
        }
      },
      coverageIstanbulReporter: {
        dir: "coverage/%browser%",
        reports: ["text-summary", "lcov"],
        skipFilesWithNoCoverage: true,
      }
    }));
  });

});
