import { ConfigOptions } from "karma";
import { NormalizedOptions } from "./normalize-options";
import { hasWebpackLoader, mergeConfig } from "./util";

/**
 * Configures Webpack to bundle test files and their dependencies.
 */
export function configureWebpack(config: ConfigOptions, { testDir, transpile }: NormalizedOptions): ConfigOptions {
  config.preprocessors = mergeConfig(config.preprocessors, {
    [`${testDir}/**/*.+(spec|test).+(js|jsx|mjs)`]: ["webpack"],
  });

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
