import { ConfigOptions } from "karma";
import { NormalizedOptions } from "./normalize-options";
import { mergeConfig } from "./util";

/**
 * Configures Webpack to bundle test files and their dependencies.
 */
export function configureWebpack(config: ConfigOptions, { testDir }: NormalizedOptions): ConfigOptions {
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
