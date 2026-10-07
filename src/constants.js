import { homedir } from "node:os";
import { join } from "node:path";
import packageJson from "../package.json" with { type: "json" };

export const VERSION = packageJson.version;
// Backend API base URL.
export const API_BASE_URL = "https://api.cloudmind.grepguard.com";

export const CONFIG_DIR = join(homedir(), ".config", "cloudmind");
export const CONFIG_PATH = join(CONFIG_DIR, "config.json");

export const SCAN_RESOURCE_KEYS = [
  "droplets",
  "volumes",
  "databases",
  "kubernetes",
  "domains",
  "loadbalancers",
];
