// sanity.config.ts  –  Standalone Sanity Studio configuration
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "zenon-studio",
  title: "Zentrics Blog",

  projectId: "mff7y2ll",
  dataset: "production",

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
