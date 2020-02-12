import { ConfigOptions } from "karma";
import { NormalizedOptions } from "./normalize-options";
import { addPlugin, hasWebpackLoader, mergeConfig } from "./util";

/**
 * Configures Webpack to bundle test files and their dependencies.
 */
export function configureWebpack(config: ConfigOptions, options: NormalizedOptions): ConfigOptions {
  let { transpile } = options;
  let globs = getEntryFileGlobs(options);

  addPlugin(config, "karma-webpack");

  for (let glob of globs) {
    config.preprocessors = mergeConfig(config.preprocessors, {
      [glob]: ["webpack"],
    });
  }

  config.webpack = mergeConfig(config.webpack, {
    mode: "development",
    devtool: "inline-source-map",
  });

  config.webpack.module = mergeConfig(config.webpack.module, {
    rules: [],
  });

  if (transpile && !hasWebpackLoader(config.webpack.module.rules, "babel-loader")) {
    config.webpack.module.rules.push({
      test: /\.(js|jsx|mjs)$/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"]
        }
      }
    });
  }

  return config;
}

/**
 * Returns the glob patterns of all entry files (tests and fixtures).
 */
function getEntryFileGlobs({ fixtures, tests }: NormalizedOptions): string[] {
  let globs = [];

  for (let patterns of [fixtures, tests]) {
    for (let pattern of patterns) {
      if (typeof pattern === "string") {
        globs.push(pattern);
      }
      else if (pattern.included !== false) {
        globs.push(pattern.pattern);
      }
    }
  }

  return globs;
}
