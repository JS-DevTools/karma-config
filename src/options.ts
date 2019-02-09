import { ConfigOptions, FilePattern } from "karma";

/**
 * Options that control the generated Karma configuration
 */
export interface Options {
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
  tests?: string | FilePattern | Array<string | FilePattern>;

  /**
   * One or more file patterns that Karma will allow to be served. This allows your tests to
   * dynamically load data, such as JSON files, CSV files, etc.
   *
   * Defaults to all files under the `testDir`.
   */
  serve?: string | FilePattern | Array<string | FilePattern>;

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
   * Most CI/CD servers automatically set the `CI` environment variable.
   *
   * Defaults to `false`.
   */
  CI?: boolean;

  /**
   * Explicit Karma configuration settings. This is useful for adding additional settings that
   * aren't normally set by Karma Config, or for overriding Karma Config's settings.
   *
   * Defaults to an empty object.
   */
  config?: ConfigOptions;
}
