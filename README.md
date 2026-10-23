# CloudMind CLI

AI-native infrastructure intelligence. Scan cloud resources and ask questions about your infrastructure.

## Installation

Install globally with npm:

```sh
npm install -g cloudmind
```

Or run it without installing:

```sh
npx cloudmind --help
```

Requirements:

- Node.js `>=24.22.1`
- A read-only API token for the cloud provider you want to scan
- An OpenAI API key (only needed for `ask`)

Verify the install:

```sh
cloudmind --version
```

## Quick start

```sh
cloudmind add do        # save a read-only DigitalOcean token
cloudmind add openai    # save an OpenAI API key (enables `ask`)
cloudmind --provider do scan
cloudmind --provider do ask "How many droplets are in the nyc3 region?"
```

>***Note:*** You can also provide the OpenAI key through the `OPENAI_API_KEY` environment variable. When both are set, the environment variable takes precedence over the key saved with the CLI.

>***Note:*** Everything you save with `cloudmind add` stays on this computer. Tokens and API keys are written to `~/.config/cloudmind/config.json` with owner-only permissions (`0600`, inside a `0700` directory), and nothing is uploaded or sent anywhere.

## Providers

A **provider** is the cloud account CloudMind reads from. Every CloudMind command works against exactly one provider, selected with the global `--provider` flag, and each provider has its own saved token.

```sh
cloudmind --provider <id> <command>
```

| Provider | ID | Status | Resources scanned |
| --- | --- | --- | --- |
| DigitalOcean | `do` | Supported | Droplets, volumes, databases, Kubernetes clusters, domains, load balancers, App Platform apps |
| Microsoft Azure | `azure` | Planned | — |
| Google Cloud Platform | `gcp` | Planned | — |
| AWS | `aws` | Planned | — |

>***Note:*** Each DigitalOcean resource request fetches up to 200 items of that type—for example, 200 droplets or 200 volumes.
