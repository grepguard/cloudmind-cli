# Cloudmind CLI

Scan cloud resources and ask questions about your cloud.

## Install

```sh
npm install -g cloudmind
```

Requires Node.js 24.13.0 or later.

## Get started

Save your DigitalOcean token:

```sh
cloudmind add do
```

Scan resources:

```sh
cloudmind --provider do scan
```

Ask a question:

```sh
cloudmind --provider do ask "Any unattached volumes or idle droplets?"
```

Credentials are stored locally in `~/.config/cloudmind/config.json` with owner-only permissions.
