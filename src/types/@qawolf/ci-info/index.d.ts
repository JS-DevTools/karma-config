declare module "@qawolf/ci-info" {
  interface CIInfo {
    isCI: boolean;
    isPR: boolean;
    name: string;
  }

  const ci: CIInfo;
  export = ci;
}
