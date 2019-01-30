import 'karma';

/**
 * @see https://github.com/mattlewis92/karma-coverage-istanbul-reporter#configuration
 */
interface CoverageConfig {
  /**
   * The code coverage reports to generate
   *
   * @see https://github.com/istanbuljs/istanbuljs/tree/master/packages/istanbul-reports/lib
   */
  reports?: string[];

  /**
   * Base output directory. If you include %browser% in the path it will be replaced with the karma browser name.
   */
  dir?: string;

  /**
   * Combines coverage information from multiple browsers into one report rather than outputting a report
   * for each browser.
   */
  combineBrowserReports?: boolean;

  /**
   * If using webpack and pre-loaders, work around webpack breaking the source path.
   */
  fixWebpackSourcePaths?: boolean;

  /**
   * Omit files with no statements, no functions and no branches from the report.
   */
  skipFilesWithNoCoverage?: boolean;

  /**
   * Most reporters accept additional config options. You can pass these through the `report-config` option
   */
  "report-config"?: Record<string, any>;

  /**
   * Enforce percentage thresholds.
   * Anything under these percentages will cause karma to fail with an exit code of 1
   * if not running in watch mode
   */
  thresholds?: {
    /**
     * Set to `true` to not fail the test command when thresholds are not met
     */
    emitWarning?: boolean;

    /**
     * Thresholds for all files
     */
    global?: Thresholds;

    /**
     * Thresholds per file
     */
    each?: Thresholds & { overrides?: Record<string, Thresholds> };
  };

  /**
   * Output config used by istanbul for debugging
   */
  verbose?: boolean;
}

interface Thresholds {
  statements?: number;
  lines?: number;
  branches?: number;
  functions?: number;
}

declare module "karma" {
  interface ConfigOptions {
      coverageIstanbulReporter: CoverageConfig;
  }
}
