"use strict";

const { host } = require("@jsdevtools/host-environment");

let env, ci;

let envDefaults = {
  KARMA_COVERAGE: "",
  KARMA_CI: "",
  CI: "",
  CI_BUILD_NUMBER: "",
  SAUCE_USERNAME: "",
  SAUCE_ACCESS_KEY: "",
  GITHUB_ACTIONS: "",
};


/**
 * Overrides the system's _actual_ environment variables with our defaults.
 * This ensures that our tests run consistently in different environments.
 */
beforeEach("Override Environment Variables", () => {
  if (!env) {
    env = {};
    ci = host.ci;

    for (let key of Object.keys(envDefaults)) {
      let value = process.env[key];
      if (value) {
        env[key] = value;
        process.env[key] = envDefaults[key];
      }
    }

    host.ci = false;
  }
});


/**
 * Restores the system's previous environment variables.
 */
afterEach("Restore Environment Variables", () => {
  if (env) {
    for (let key of Object.keys(env)) {
      process.env[key] = env[key];
    }
  }

  env = null;
  host.ci = ci;
});
