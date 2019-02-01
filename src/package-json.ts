import { readFileSync } from "fs";
import ono from "ono";
import { PackageJson } from "package-json"; // tslint:disable-line: no-implicit-dependencies

let pkg: PackageJson | undefined;

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
