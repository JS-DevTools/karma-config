"use strict";

let env;

let envDefaults = {
  KARMA_COVERAGE: "",
  KARMA_PLATFORM: "",
  KARMA_CI: "",
  CI: "",
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

  for (let key of Object.keys(envDefaults)) {
    let value = process.env[key];
    if (value) {
      env[key] = value;
      process.env[key] = envDefaults[key];
    }
  }
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
}
