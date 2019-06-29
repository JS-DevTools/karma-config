import { RuleSetRule, RuleSetUseItem } from "webpack";

// tslint:disable-next-line: no-any
type POJO = Record<string, any>;

/**
 * Does a shallow merge of two objects, only overriding values that are `undefined`.
 */
export function mergeConfig<T extends POJO>(target: T | undefined, defaults: Partial<T>): T {
  let config = target || {} as T;  // tslint:disable-line: no-object-literal-type-assertion

  for (let key of Object.keys(defaults)) {
    let defaultValue = defaults[key];

    if (config[key] === undefined) {
      // tslint:disable-next-line: no-any
      (config as any)[key] = defaultValue;
    }
  }

  return config;
}

/**
 * Determines whether the specified Webpack loader already exists in the rules list.
 */
export function hasWebpackLoader(rules: RuleSetRule[], name: string): boolean {
  for (let rule of rules) {
    if (rule && rule.use) {
      if (Array.isArray(rule.use)) {
        for (let loader of rule.use) {
          if (webpackLoaderName(loader) === name) {
            return true;
          }
        }
      }
      else if (webpackLoaderName(rule.use as RuleSetUseItem) === name) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Returns the name of the given Webpack loader, if possible.
 */
export function webpackLoaderName(loader: RuleSetUseItem): string | undefined {
  if (typeof loader === "string") {
    return loader;
  }
  else if (typeof loader === "object") {
    return loader.loader;
  }
}
