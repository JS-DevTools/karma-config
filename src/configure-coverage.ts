import { ConfigOptions } from "karma";
import { NormalizedOptions } from "./normalize-options";
import { hasWebpackLoader, mergeConfig } from "./util";

/**
 * Configures Karma and Webpack to gather code-coverage data.
 */
export function configureCoverage(config: ConfigOptions, { coverage, sourceDir }: NormalizedOptions): ConfigOptions {
  if (!coverage) {
    return config;
  }

  if (!config.reporters!.includes("coverage-istanbul")) {
    config.reporters!.push("coverage-istanbul");
  }

  config.coverageIstanbulReporter = mergeConfig(config.coverageIstanbulReporter, {
    dir: "coverage/%browser%",
    reports: ["text-summary", "lcov"],
    skipFilesWithNoCoverage: true,
  });

  if (!hasWebpackLoader(config.webpack.module!.rules, "coverage-istanbul-loader")) {
    config.webpack.module!.rules.push({
      test: /\.jsx?$/,
      include: new RegExp(sourceDir.replace(/\//g, "\/")),
      exclude: /node_modules|\.spec\.|\.test\./,
      enforce: "post",
      use: "coverage-istanbul-loader",
    });
  }

  return config;
}