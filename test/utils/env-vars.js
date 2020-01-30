"use strict";

const ci = require("@qawolf/ci-info");

let env, isCI;

let envDefaults = {
  KARMA_COVERAGE: "",
  KARMA_PLATFORM: "",
  KARMA_CI: "",
  CI: "",
  CI_BUILD_NUMBER: "",
  SAUCE_USERNAME: "",
  SAUCE_ACCESS_KEY: "",
  GITHUB_ACTIONS: "",
};

module.exports = {
  override: overrideEnvironmentVariables,
  restore: restoreEnvironmentVariables,
};

/**
 * Overrides the system's _actual_ environment variables with our defaults.
 * This ensures that our tests run consistently in different environments.
 */
function overrideEnvironmentVariables () {
  if (env) {
    throw new Error("Cannot override environment variables again");
  }

  env = {};
  isCI = ci.isCI;

  for (let key of Object.keys(envDefaults)) {
    let value = process.env[key];
    if (value) {
      env[key] = value;
      process.env[key] = envDefaults[key];
    }
  }

  ci.isCI = false;
}

/**
 * Restores the system's previous environment variables.
 */
function restoreEnvironmentVariables () {
  if (env) {
    for (let key of Object.keys(env)) {
      process.env[key] = env[key];
    }
  }

  env = null;
  ci.isCI = isCI;
}
