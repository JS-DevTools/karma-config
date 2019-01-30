import { ConfigOptions, FilePattern } from "karma";
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

  configureWebpack(config, opts);
  configureBrowsers(config, opts);

  opts.typescript && configureTypescript(config, opts);
  opts.coverage && configureCoverage(config, opts);

  return config;
}

/**
 * Configures Webpack to bundle test files and their dependencies.
 */
function configureWebpack(config: ConfigOptions, { testDir }: NormalizedOptions): void {
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
}

/**
 * Configures Karma and Webpack to support TypeScript files.
 */
function configureTypescript(config: ConfigOptions, options: NormalizedOptions): void {
  const tsExtensions = ["ts", "tsx"];

  config.mime = mergeConfig(config.mime, {
    "text/x-typescript": tsExtensions,
  });

  config.webpack.resolve = mergeConfig(config.webpack.resolve, {
    extensions: [".js", ".jsx", ".mjs", ".json"],
  });

  for (let ext of tsExtensions) {
    if (!config.webpack.resolve.extensions!.includes("." + ext)) {
      config.webpack.resolve.extensions!.push("." + ext);
    }
  }

  if (!hasWebpackLoader(config.webpack.module!.rules, "ts-loader")) {
    // Insert the ts-loader at the beginning of the rules list
    config.webpack.module!.rules.unshift({ test: /\.tsx?$/, use: "ts-loader" });
  }
}

/**
 * Configures Karma and Webpack to gather code-coverage data.
 */
function configureCoverage(config: ConfigOptions, options: NormalizedOptions): void {
  if (!config.reporters!.includes("coverage-istanbul")) {
    config.reporters!.push("coverage-istanbul");
  }

  config.coverageIstanbulReporter = mergeConfig(config.coverageIstanbulReporter, {
    dir: "coverage/%browser%",
    reports: ["text-summary", "lcov"],
  });

  if (!hasWebpackLoader(config.webpack.module!.rules, "istanbul-instrumenter-loader")) {
    config.webpack.module!.rules.push({
      test: options.typescript ? /\.tsx?$/ : /\.jsx?$/,
      include: new RegExp(options.sourceDir.replace(/\//g, "\/")),
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

function hasWebpackLoader(rules, name) {
  for (let rule of rules) {
    if (rule && rule.use) {
      if (rule.use === name || rule.use.loader === name) {
        return true;
      }

      if (Array.isArray(rule.use)) {
        let found = hasWebpackLoader(rule.use, name);
        if (found) {
          return true;
        }
      }
    }
  }
}
