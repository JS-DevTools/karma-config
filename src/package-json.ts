import { readFileSync } from "fs";
import ono from "ono";  // tslint:disable-line: match-default-export-name
import { FullVersion } from "package-json";

let pkg: FullVersion | undefined;

/**
 * Reads the host project's package.json file and returns its parsed contents.
 */
export function readPackageJson(): FullVersion {
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
    pkg = JSON.parse(json) as FullVersion;
    return pkg;
  }
  catch (error) {
    throw ono.syntax(error as Error, "Error parsing package.json");
  }
}
