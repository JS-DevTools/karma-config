import { ConfigOptions, FilePattern } from "karma";

/**
 * Options that control the generated Karma configuration
 */
export interface Options {
  /**
   * Indicates whether code coverage analysis should be performed.
   * If set to `true`, then Webpack will be configured to inject code-coverage instrumentation
   * and write code-coverage reports in the "coverage" directory.
   *
   * This option can also be enabled by setting the `KARMA_COVERAGE` environment variable,
   * or by using the `--coverage` command-line flag when running Karma.
   *
   * Defaults to `false`.
   */
  coverage?: boolean;

  /**
   * The operating system platform (e.g. "linux", "win32", "darwin", etc.).
   * This determines which browsers will be launched by Karma.
   *
   * This option can also be set via the `KARMA_PLATFORM` environment variable.
   *
   * Defaults to `process.platform`.
   *
   * @see https://nodejs.org/api/process.html#process_process_platform
   */
  platform?: string;

  /**
   * Indicates whether Karma is running in a CI environment.
   * If set to `true`, then Karma will be configured to run headless browsers where possible.
   *
   * This option can also be enabled by setting the `CI` or `KARMA_CI` environment variables.
   *
   * Defaults to `false`.
   */
  CI?: boolean;

  /**
   * The relative path of the source directory.
   *
   * Defaults to "src".
   */
  sourceDir?: string;

  /**
   * The relative path of the test directory.
   *
   * Defaults to "test".
   */
  testDir?: string;

  /**
   * One or more file patterns that specify your test files. These are the files that will be
   * built by Webpack and run by Karma.
   *
   * Defaults to all JavaScript files under the `testDir` that have ".spec" or ".test" before
   * their file extension (e.g. "test/scripts/my-lib.spec.js")
   */
  testFiles?: string | FilePattern | Array<string | FilePattern>;

  /**
   * One or more file patterns that Karma will allow to be served. This allows your tests to
   * dynamically load data, such as JSON files, CSV files, etc.
   *
   * Defaults to all files under the `testDir`.
   */
  serveFiles?: string | FilePattern | Array<string | FilePattern>;

  /**
   * Explicit Karma configuration settings. This is useful for adding additional settings that
   * aren't normally set by Karma Config, or for overriding Karma Config's settings.
   *
   * Defaults to an empty object.
   */
  config?: ConfigOptions;
}

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
  testFiles: Array<string | FilePattern>;
  serveFiles: Array<string | FilePattern>;
  config: ConfigOptions;
}

/**
 * Normalizes user-specified options and applies defaults.
 */
export function normalizeOptions(options?: Partial<Options>): NormalizedOptions {
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
    testFiles: arrayify(options.testFiles) || [`${testDir}/**/*.+(spec|test).+(js|jsx)`],
    serveFiles: arrayify(options.serveFiles) || [`${testDir}/**/*`],
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
