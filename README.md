# Cloudmind CLI

A small CLI for scanning cloud resources and asking questions about them.

## Install for local development

```sh
npm install
npm link
```

## Save a provider token

```sh
cloudmind add do
```

The CLI securely prompts for the provider token. Settings are saved locally in `~/.config/cloudmind/config.json` with owner-only file permissions.

## List providers

```sh
cloudmind providers
```

## Scan resources

```sh
cloudmind --provider do scan
```

The CLI calls `GET /do/scan` and sends the saved provider token as a Bearer authorization header.

## Ask a question

```sh
cloudmind --provider do ask "Any unattached volumes or idle droplets?"
```

Omit the question to be prompted for one. The CLI calls `POST /ask` with `{ "provider": "do", "question": "..." }` and sends the same Bearer authorization header.
