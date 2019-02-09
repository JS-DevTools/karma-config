import { ConfigOptions, FilePattern } from "karma";
import { Options } from "./options";

/**
 * Normalized options with defaults applied.
 */
export interface NormalizedOptions {
  coverage: boolean;
  windows: boolean;
  mac: boolean;
  linux: boolean;
  CI: boolean;
  sourceDir: string;
  testDir: string;
  tests: Array<string | FilePattern>;
  serve: Array<string | FilePattern>;
  config: ConfigOptions;
}

/**
 * Normalizes user-specified options and applies defaults.
 */
export function normalizeOptions(options?: Options): NormalizedOptions {
  options = options || {};
  let coverage = options.coverage === undefined ? defaultCoverage() : Boolean(options.coverage);
  let platform = options.platform === undefined ? defaultPlatform() : String(options.platform).toLowerCase();
  let CI = options.CI === undefined ? defaultCI() : Boolean(options.CI);
  let sourceDir = options.sourceDir === undefined ? "src" : String(options.sourceDir);
  let testDir = options.testDir === undefined ? "test" : String(options.testDir);

  let windows = /^win/.test(platform);
  let mac = /^darwin|^mac|^osx/.test(platform);
  let linux = !mac && !windows;

  return {
    coverage,
    windows,
    mac,
    linux,
    CI,
    sourceDir,
    testDir,
    tests: arrayify(options.tests) || [`${testDir}/**/*.+(spec|test).+(js|jsx)`],
    serve: arrayify(options.serve) || [`${testDir}/**/*`],
    config: Object.assign({}, options.config),
  };
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
 * Returns the default value for the `platform` option, possibly from an environment variable.
 */
function defaultPlatform(): string {
  let envVar = environmentVariable("KARMA_PLATFORM");
  return envVar || process.platform;
}

/**
 * Returns the default value for the `CI` option, possibly from an environment variable.
 */
function defaultCI(): boolean {
  let CI = environmentFlag("CI");
  let karmaCI = environmentFlag("KARMA_CI");

  return CI || karmaCI;
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
