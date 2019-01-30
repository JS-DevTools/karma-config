import { ConfigOptions, FilePattern } from "karma";
import { arrayify } from "./util";

/**
 * Options that control the generated Karma configuration
 */
export interface Options {
  /**
   * Indicates whether this is a TypeScript project (i.e. the source is written in TypeScript).
   * If set to `true`, then Webpack will be configured to support TypeScript.
   *
   * Defaults to `false`.
   */
  typescript?: boolean;

  /**
   * Indicates whether code coverage analysis should be performed.
   * If set to `true`, then Webpack will be configured to inject code-coverage instrumentation
   * and write code-coverage reports in the "coverage" directory.
   *
   * Defaults to `false`, or `true` if the `--coverage` command-line flag is used when running Karma.
   */
  coverage?: boolean;

  /**
   * The relative path of the source directory.
   *
   * Defaults to "lib", or "src" if this is a TypeScript project.
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
  typescript: boolean;
  coverage: boolean;
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
  let typescript = options.typescript === undefined ? true : Boolean(options.typescript);
  let sourceDir = options.sourceDir === undefined ? typescript ? "src" : "lib" : String(options.sourceDir);
  let testDir = options.testDir === undefined ? "test" : String(options.testDir);

  return {
    typescript,
    coverage: options.coverage === undefined ? process.argv.includes("--coverage") : Boolean(options.coverage),
    sourceDir,
    testDir,
    testFiles: arrayify(options.testFiles) || [`${testDir}/**/*.+(spec|test).+(js|jsx)`],
    serveFiles: arrayify(options.serveFiles) || [`${testDir}/**/*`],
    config: Object.assign({}, options.config),
  };
}
