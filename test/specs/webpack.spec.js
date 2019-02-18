"use strict";

const { buildConfig } = require("../../");
const { expect } = require("chai");
const { defaultBrowsers, mergeConfig } = require("../utils/config");
const envVars = require("../utils/env-vars");

describe("webpack config", () => {
  beforeEach(envVars.override);
  afterEach(envVars.restore);

  it("should configure webpack by default", () => {
    let config = buildConfig();

    expect(config).to.deep.equal(mergeConfig({
      webpack: {
        mode: "development",
        devtool: "inline-source-map",
        module: {
          rules: [],
        }
      }
    }));
  });

  it("should not use babel by default on non-Windows platforms, even if IE is supported", () => {
    let config = buildConfig({
      platform: "MacOS",
      browsers: {
        ie: true
      }
    });

    let expectedBrowsers = defaultBrowsers.slice();
    if (process.platform === "win32") {
      expectedBrowsers.push("IE");
    }

    expect(config).to.deep.equal(mergeConfig({
      browsers: ["Chrome", "Firefox", "Safari"],
    }));
  });

  it("should configure webpack and babel by default if running on Windows with IE enabled", () => {
    let config = buildConfig({
      platform: "windows",
      browsers: {
        ie: true
      }
    });

    let expectedBrowsers = defaultBrowsers.slice();
    if (process.platform === "win32") {
      expectedBrowsers.push("IE");
    }

    expect(config).to.deep.equal(mergeConfig({
      browsers: ["Chrome", "Firefox", "Edge", "IE"],
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

  it("should configure webpack and babel if the transiple option is set", () => {
    let config = buildConfig({ transpile: true });

    expect(config).to.deep.equal(mergeConfig({
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

  it("should not override user-specified babel-loader settings", () => {
    let config = buildConfig({
      transpile: true,
      config: {
        webpack: {
          module: {
            rules: [
              { test: /\.js$/, use: "babel-loader" }
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
            { test: /\.js$/, use: "babel-loader" }
          ]
        }
      }
    }));
  });

});
