export * from "karma";

declare module "karma" {
  interface CustomLauncher {
    version: string;
  }
}
