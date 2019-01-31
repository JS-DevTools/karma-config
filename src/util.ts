import { readFileSync } from "fs";
import ono from "ono";
import { PackageJson } from "package-json"; // tslint:disable-line: no-implicit-dependencies

let pkg: PackageJson | undefined;

/**
 * Any JavaScript object, as a map of property keys and values.
 */
export type POJO = Record<string, unknown>;

/**
 * Wraps the given value in an array, if necessary
 */
export function arrayify<T>(value: T | T[] | undefined): T[] | undefined {
  if (Array.isArray(value)) {
    return value;
  }
  else if (value) {
    return [value];
  }
}

/**
 * Does a shallow merge of two objects, only overriding values that are `undefined`.
 */
export function mergeConfig<T extends POJO>(target: T | undefined, defaults: POJO): T {
  let config = target || {} as T;  // tslint:disable-line: no-object-literal-type-assertion

  for (let key of Object.keys(defaults)) {
    let defaultValue = defaults[key];

    if (config[key] === undefined) {
      config[key] = defaultValue;
    }
  }

  return config;
}

/**
 * Returns the boolean value of the specified environment variable.
 */
export function environmentFlag(name: string): boolean {
  let value = environmentVariable(name);
  return !["", "false", "off", "no"].includes(value);
}

/**
 * Returns the normalized string value of the specified environment variable.
 */
export function environmentVariable(name: string): string {
  return (process.env[name] || "").trim().toLowerCase();
}

/**
 * Reads the host project's package.json file and returns its parsed contents.
 */
export function readPackageJson(): PackageJson {
  if (pkg) {
    return pkg;
  }

  let json;

  try {
    json = readFileSync("package.json", "utf8");
  }
  catch (error) {
    throw ono(error as Error, "Error reading package.json");
  }

  try {
    pkg = JSON.parse(json) as PackageJson;
    return pkg;
  }
  catch (error) {
    throw ono.syntax(error as Error, "Error parsing package.json");
  }
}
