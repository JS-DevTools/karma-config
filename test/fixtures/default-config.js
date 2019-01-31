"use strict";

let browsers = ["Firefox", "Chrome"];

switch (process.platform) {
  case "win32":
    browsers.push("Edge");
    break;
  case "darwin":
    browsers.push("Safari");
    break;
}

module.exports = {
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
