import "karma";

/**
 * @see https://github.com/mattlewis92/karma-coverage-istanbul-reporter#configuration
 */
interface CoverageConfig {
  reports?: string[];
  dir?: string;
  combineBrowserReports?: boolean;
  fixWebpackSourcePaths?: boolean;
  skipFilesWithNoCoverage?: boolean;
  "report-config"?: Record<string, any>;
  thresholds?: {
    emitWarning?: boolean;
    global?: Thresholds;
    each?: Thresholds & { overrides?: Record<string, Thresholds> };
  };
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
