import { ConfigOptions } from "karma";
import { NormalizedOptions } from "./normalize-options";
import { addPlugin, hasWebpackLoader, mergeConfig } from "./util";

/**
 * Configures Karma and Webpack to gather code-coverage data.
 */
export function configureCoverage(config: ConfigOptions, { coverage, sourceDir }: NormalizedOptions): ConfigOptions {
  if (!coverage) {
    return config;
  }

  addPlugin(config, "karma-coverage-istanbul-reporter");

  if (!config.reporters!.includes("coverage-istanbul")) {
    config.reporters!.push("coverage-istanbul");
  }

  config.coverageIstanbulReporter = mergeConfig(config.coverageIstanbulReporter, {
    dir: "coverage/%browser%",
    reports: ["text-summary", "lcov"],
    skipFilesWithNoCoverage: true,
  });

  if (!hasWebpackLoader(config.webpack.module!.rules, "coverage-istanbul-loader")
  && !hasWebpackLoader(config.webpack.module!.rules, "@jsdevtools/coverage-istanbul-loader")) {
    config.webpack.module!.rules.push({
      test: /\.(js|jsx|mjs)$/,
      include: new RegExp(sourceDir.replace(/\//g, "\/")),
      exclude: /node_modules|\.spec\.|\.test\./,
      enforce: "post",
      use: "@jsdevtools/coverage-istanbul-loader",
    });
  }

  return config;
}
