# Cloudmind CLI

A small CLI for scanning cloud resources and asking questions about them.

## Install for local development

```sh
npm install
npm link
```

## Providers

| ID   | Name         |
| ---- | ------------ |
| `do` | DigitalOcean |

## Save a provider token

```sh
cloudmind add do
```

>**Note**: The CLI securely prompts for the provider token. Settings are saved locally in `~/.config/cloudmind/config.json` with owner-only file permissions.

## List providers

```sh
cloudmind providers
```

## Scan resources

```sh
cloudmind --provider do scan
```

## Ask a question

```sh
cloudmind --provider do ask "Any unattached volumes or idle droplets?"
```
