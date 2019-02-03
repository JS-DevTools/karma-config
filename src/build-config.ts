import { ConfigOptions, FilePattern } from "karma";
import { RuleSetRule, RuleSetUseItem } from "webpack";
import { configureBrowsers } from "./configure-browsers";
import { NormalizedOptions, normalizeOptions, Options } from "./options";
import { mergeConfig } from "./util";

/**
 * Builds the Kamra configuration object based on the given options.
 */
export function buildConfig(options: Options): ConfigOptions {
  let opts = normalizeOptions(options);

  let config = mergeConfig(opts.config, {
    frameworks: ["mocha", "chai", "host-environment"],
    reporters: ["verbose"],
    files: opts.testFiles.concat(opts.serveFiles.map(serveFile)),
  });

  config = configureWebpack(config, opts);
  config = configureBrowsers(config, opts);
  config = configureCoverage(config, opts);

  return config;
}

/**
 * Configures Webpack to bundle test files and their dependencies.
 */
function configureWebpack(config: ConfigOptions, { testDir }: NormalizedOptions): ConfigOptions {
  config.preprocessors = mergeConfig(config.preprocessors, {
    [`${testDir}/**/*.+(spec|test).+(js|jsx)`]: ["webpack"],
  });

  config.webpack = mergeConfig(config.webpack, {
    mode: "development",
    devtool: "inline-source-map",
  });

  config.webpack.module = mergeConfig(config.webpack.module, {
    rules: [],
  });

  return config;
}

/**
 * Configures Karma and Webpack to gather code-coverage data.
 */
function configureCoverage(config: ConfigOptions, { coverage, sourceDir }: NormalizedOptions): ConfigOptions {
  if (!coverage) {
    return config;
  }

  if (!config.reporters!.includes("coverage-istanbul")) {
    config.reporters!.push("coverage-istanbul");
  }

  config.coverageIstanbulReporter = mergeConfig(config.coverageIstanbulReporter, {
    dir: "coverage/%browser%",
    reports: ["text-summary", "lcov"],
  });

  if (!hasWebpackLoader(config.webpack.module!.rules, "istanbul-instrumenter-loader")) {
    config.webpack.module!.rules.push({
      test: /\.jsx?$/,
      include: new RegExp(sourceDir.replace(/\//g, "\/")),
      exclude: /node_modules|\.spec\.|\.test\./,
      enforce: "post",
      use: {
        loader: "istanbul-instrumenter-loader",
        options: {
          esModules: true,
        },
      }
    });
  }

  return config;
}

/**
 * Returns a FilePattern that serves the specified file, but does not include it by default.
 */
function serveFile(file: string | FilePattern): FilePattern {
  if (typeof file === "string") {
    return { pattern: file, included: false, served: true };
  }
  else {
    file.served = true;
    return file;
  }
}

/**
 * Determines whether the specified Webpack loader already exists in the rules list.
 */
function hasWebpackLoader(rules: RuleSetRule[], name: string): boolean {
  for (let rule of rules) {
    if (rule && rule.use) {
      if (Array.isArray(rule.use)) {
        for (let loader of rule.use) {
          if (webpackLoaderName(loader) === name) {
            return true;
          }
        }
      }
      else {
        return webpackLoaderName(rule.use as RuleSetUseItem) === name;
      }
    }
  }

  return false;
}

/**
 * Returns the name of the given Webpack loader, if possible.
 */
function webpackLoaderName(loader: RuleSetUseItem): string | undefined {
  if (typeof loader === "string") {
    return loader;
  }
  else if (typeof loader === "object") {
    return loader.loader;
  }
}
