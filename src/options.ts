import { ConfigOptions, FilePattern } from "karma";

/**
 * Options that control the generated Karma configuration
 */
export interface Options {
  /**
   * Indicates which browsers you want to support.
   */
  browsers?: {
    /**
     * Indicates whether Chrome is supported.  If `true`, then your tests will be run in Chrome on all platforms.
     *
     * Defaults to `true`.
     */
    chrome?: boolean;

    /**
     * Indicates whether Firefox is supported.  If `true`, then your tests will be run in Firefox on all platforms.
     *
     * Defaults to `true`.
     */
    firefox?: boolean;

    /**
     * Indicates whether Safari is supported.  If `true`, then your tests will be run in Safari when on a Mac.
     *
     * Defaults to `true`.
     */
    safari?: boolean;

    /**
     * Indicates whether Edge is supported.  If `true`, then your tests will be run in Edge when on Windows.
     *
     * Defaults to `true`.
     */
    edge?: boolean;

    /**
     * Indicates whether Internet Explorer is supported.  If `true`, then your tests will be run
     * in Internet Explorer when on Windows.
     *
     * Defaults to `false`.
     */
    ie?: boolean;
  };

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
   * One or more file patterns that specify your test fixtures. Test fixtures will be run _before_
   * any of your test files are loaded, which gives you an opportunity to setup the runtime environment,
   * load polyfills, etc.
   *
   * This option has no default value.
   */
  fixtures?: string | FilePattern | Array<string | FilePattern>;

  /**
   * One or more file patterns that Karma will allow to be served. This allows your tests to
   * dynamically load data, such as JSON files, CSV files, etc.
   *
   * Defaults to all files under the `testDir`.
   */
  serve?: string | FilePattern | Array<string | FilePattern>;

  /**
   * Indicates whether your source code should be transpiled to ES5 syntax to support older
   * web browsers. If set to `true`, then Webpack will be configured to use Babel.
   *
   * If `browsers.ie` is enabled, then this option defaults to `true` when running on Windows.
   *
   * Defaults to `false`.
   */
  transpile?: boolean;

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
   * By default, Karma Config will auto-detect most CI environments.
   *
   * @see https://www.npmjs.com/package/@qawolf/ci-info#supported-ci-tools
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
