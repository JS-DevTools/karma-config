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
