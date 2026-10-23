import { homedir } from "node:os";
import { join } from "node:path";
import packageJson from "../package.json" with { type: "json" };

export const VERSION = packageJson.version;
export const OPENAI_MODEL = "gpt-6-luna";

export const CONFIG_DIR = join(homedir(), ".config", "cloudmind");
export const CONFIG_PATH = join(CONFIG_DIR, "config.json");

export const SCAN_RESOURCE_KEYS = [
  "droplets",
  "volumes",
  "databases",
  "kubernetes",
  "domains",
  "loadbalancers",
  "apps",
];
