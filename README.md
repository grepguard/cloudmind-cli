# Cloudmind CLI

Scan cloud resources and ask questions about your cloud.

## Install

```sh
npm install -g cloudmind
```

> **Note:** Requires Node.js 24.13.0 or later.

## Get started

| Name                  | ID       | Supported |
| --------------------- | -------- | --------- |
| DigitalOcean          | `do`     | ✓         |
| Microsoft Azure       | `azure`  | —         |
| Google Cloud Platform | `gcp`    | —         |
| AWS                   | `aws`    | —         |

Save your cloud provider's read-only API token:

```sh
cloudmind add do
```

> **Note:** Credentials are stored locally in `~/.config/cloudmind/config.json` with owner-only permissions.

Scan resources:

```sh
cloudmind --provider do scan
```

Ask a question:

```sh
cloudmind --provider do ask "How many droplets are in the nyc3 region?"
```
