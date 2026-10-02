import { homedir } from "node:os";
import { join } from "node:path";

export const VERSION = "0.0.1";
// Single place to change when the backend moves (for now local dev).
export const API_BASE_URL = "http://localhost:3000";

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
