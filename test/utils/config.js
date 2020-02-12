"use strict";

const { expect } = require("chai");

/**
 * @typedef {import("karma").ConfigOptions} ConfigOptions
 */

let defaultBrowsers = [];
let defaultPlugins = [
  "framework:host-environment",
  "reporter:verbose",
  "framework:mocha",
  "preprocessor:webpack",
];

switch (process.platform) {
  case "win32":
    defaultBrowsers.push("Edge");
    defaultPlugins.push("launcher:Edge");
    break;
  case "darwin":
    defaultBrowsers.push("Safari");
    defaultPlugins.push("launcher:Safari");
    break;
  default:
    defaultBrowsers.push("Chrome", "Firefox");
    defaultPlugins.push("launcher:Chrome", "launcher:Firefox");
    break;
}

const defaultConfig = {
  browsers: defaultBrowsers,
  frameworks: ["mocha", "host-environment"],
  plugins: defaultPlugins,
  files: [
    "test/**/*.+(spec|test).+(js|jsx|mjs)",
    { pattern: "test/**/*", included: false, served: true }
  ],
  preprocessors: {
    "test/**/*.+(spec|test).+(js|jsx|mjs)": ["webpack"]
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
 * Compares the actual config to the expected config.
 *
 * @param {ConfigOptions} config
 * @returns {function}
 */
function compareConfig (expected) {
  expected = Object.assign({}, defaultConfig, expected);

  return (actual) => {
    // Compare plugins using special logic
    comparePlugins(actual.plugins, expected.plugins);

    // Compare the remaining properties directly
    delete actual.plugins;
    delete expected.plugins;
    expect(actual).to.deep.equal(expected);

    return true;
  };
}

/**
 * Compares the actual Karma plugins to the expected plugins
 *
 * @param {array} actual
 * @param {string[]} expected
 */
function comparePlugins (actual, expected) {
  // Get the names of all the loaded plugins
  let actualNames = actual.reduce((plugins, plugin) => {
    typeof plugin === "string" ? plugins.push(plugin) : plugins.push(...Object.keys(plugin));
    return plugins;
  }, []);

  // Make sure the number of plugins match
  if (actual.length !== expected.length) {
    expect(actualNames).to.have.same.members(expected, `Expected ${expected.length} Karma plugins, but got ${actual.length}`);
  }

  // Make sure all of the expected plugins exist.
  // The actual list will be longer, since Karma plugins can expose multiple things.
  expect(actualNames).to.include.members(expected, "Incorrect Karma Plugins");
}

module.exports = { defaultBrowsers, defaultPlugins, defaultConfig, compareConfig };
