import * as ci from "@qawolf/ci-info";
import { ConfigOptions, FilePattern } from "karma";
import { Options } from "./options";

/**
 * Normalized options with defaults applied.
 */
export interface NormalizedOptions {
  windows: boolean;
  mac: boolean;
  linux: boolean;
  testDir: string;
  sourceDir: string;
  CI: boolean;
  transpile: boolean;
  coverage: boolean;
  tests: Array<string | FilePattern>;
  fixtures: Array<string | FilePattern>;
  serve: Array<string | FilePattern>;
  config: ConfigOptions;
  browsers: {
    chrome: boolean;
    firefox: boolean;
    safari: boolean;
    edge: boolean;
    ie: boolean;
  };
}

/**
 * Normalizes user-specified options and applies defaults.
 */
export function normalizeOptions(options?: Options): NormalizedOptions {
  options = options || {};
  options.browsers = options.browsers || {};

  let platform = normalizeOption(options.platform, process.platform, String).toLowerCase();
  let windows = /^win/.test(platform);
  let mac = /^darwin|^mac|^osx/.test(platform);
  let linux = !mac && !windows;

  let testDir = normalizeOption(options.testDir, "test", String);
  let ie = normalizeOption(options.browsers.ie, false, Boolean);

  return {
    windows,
    mac,
    linux,
    testDir,
    sourceDir: normalizeOption(options.sourceDir, "src", String),
    CI: normalizeOption(options.CI, defaultCI(), Boolean),
    transpile: normalizeOption(options.transpile, windows && ie, Boolean),
    coverage: normalizeOption(options.coverage, defaultCoverage(), Boolean),
    tests: arrayify(options.tests) || [`${testDir}/**/*.+(spec|test).+(js|jsx|mjs)`],
    fixtures: arrayify(options.fixtures) || [],
    serve: arrayify(options.serve) || [`${testDir}/**/*`],
    config: Object.assign({}, options.config),
    browsers: {
      chrome: normalizeOption(options.browsers.chrome, true, Boolean),
      firefox: normalizeOption(options.browsers.firefox, true, Boolean),
      safari: normalizeOption(options.browsers.safari, true, Boolean),
      edge: normalizeOption(options.browsers.edge, true, Boolean),
      ie,
    },
  };
}

/**
 * Returns the given option as the appropriate type, or the default value.
 */
function normalizeOption<T>(option: T | undefined, defaultValue: T, type: (value: unknown) => T): T {
  if (option === undefined) {
    return defaultValue;
  }
  else {
    return type(option);
  }
}

/**
 * Returns the default value for the `coverage` option, possibly from the CLI or environment variable.
 */
function defaultCoverage(): boolean {
  let envVar = environmentFlag("KARMA_COVERAGE");
  let cliFlag = process.argv.includes("--coverage");

  return cliFlag || envVar;
}

/**
 * Returns the default value for the `CI` option, possibly from an environment variable.
 */
function defaultCI(): boolean {
  let CI = environmentFlag("CI");
  let karmaCI = environmentFlag("KARMA_CI");

  return CI || karmaCI || ci.isCI;
}

/**
 * Wraps the given value in an array, if necessary
 */
export function arrayify<T>(value: T | T[] | undefined): T[] | undefined {
  if (Array.isArray(value)) {
    return value;
  }
  else if (value) {
    return [value];
  }
}
/**
 * Returns the boolean value of the specified environment variable.
 */
export function environmentFlag(name: string): boolean {
  let value = environmentVariable(name);
  return !["", "false", "off", "no"].includes(value);
}

/**
 * Returns the normalized string value of the specified environment variable.
 */
export function environmentVariable(name: string): string {
  return (process.env[name] || "").trim().toLowerCase();
}
