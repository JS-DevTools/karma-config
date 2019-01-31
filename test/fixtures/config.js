"use strict";

/**
 * @typedef {import("karma").ConfigOptions} ConfigOptions
 */

let browsers = ["Firefox", "Chrome"];

switch (process.platform) {
  case "win32":
    browsers.push("Edge");
    break;
  case "darwin":
    browsers.push("Safari");
    break;
}

const defaultConfig = {
  browsers,
  frameworks: ["mocha", "chai", "host-environment"],
  files: [
    "test/**/*.+(spec|test).+(js|jsx)",
    { pattern: "test/**/*", included: false, served: true }
  ],
  preprocessors: {
    "test/**/*.+(spec|test).+(js|jsx)": ["webpack"]
  },
  reporters: ["verbose"],
  webpack: {
    mode: "development",
    devtool: "inline-source-map",
    module: {
      rules: []
    }
  }
};

/**
 * Merges the given config with the default config;
 *
 * @param {ConfigOptions} config
 * @returns {ConfigOptions}
 */
function mergeConfig (config) {
  return Object.assign({}, defaultConfig, config);
}

module.exports = { defaultConfig, mergeConfig };
