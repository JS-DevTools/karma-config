type POJO = Record<string, unknown>;

/**
 * Does a shallow merge of two objects, only overriding values that are `undefined`.
 */
export function mergeConfig<T extends POJO>(target: T | undefined, defaults: Partial<T>): T {
  let config = target || {} as T;  // tslint:disable-line: no-object-literal-type-assertion

  for (let key of Object.keys(defaults)) {
    let defaultValue = defaults[key];

    if (config[key] === undefined) {
      config[key] = defaultValue;
    }
  }

  return config;
}
