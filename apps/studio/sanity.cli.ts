// sanity.cli.ts  –  CLI configuration for sanity deploy, sanity manage, etc.
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "mff7y2ll",
    dataset: "production",
  },
});
