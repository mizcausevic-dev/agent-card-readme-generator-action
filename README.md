# agent-card-readme-generator-action

[![CI](https://github.com/mizcausevic-dev/agent-card-readme-generator-action/actions/workflows/ci.yml/badge.svg)](https://github.com/mizcausevic-dev/agent-card-readme-generator-action/actions/workflows/ci.yml)
[![License: AGPL-3.0-or-later](https://img.shields.io/badge/License-AGPL--3.0--or--later-blue.svg)](LICENSE)

GitHub Action that **renders a human-readable Markdown README from an A2A AgentCard JSON**. Wraps [`agent-card-readme-generator`](https://github.com/mizcausevic-dev/agent-card-readme-generator). Posts the rendered Markdown as a PR comment, and/or writes it to a target file path — auto-updates `docs/agent-card.md` so the rendered doc stays in lockstep with the JSON.

**First in the per-protocol readme-generator Action quintet** (sibling to the diff & fleet-summary quintets).

Part of the [Kinetic Gain Suite](https://suite.kineticgain.com/).

---

## Usage

### Auto-update a docs file on every change to the AgentCard

```yaml
name: Sync AgentCard README
on:
  push:
    branches: [main]
    paths: ["agents/**/*.json"]

permissions:
  contents: write

jobs:
  sync-readme:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: mizcausevic-dev/agent-card-readme-generator-action@v0.1-shipped
        with:
          card-path: agents/my-agent.json
          output-path: docs/my-agent.md
      - run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add docs/my-agent.md
          git diff --staged --quiet || git commit -m "docs: auto-sync AgentCard README"
          git push
```

### Post the rendered Markdown as a PR comment

```yaml
on:
  pull_request:
    paths: ["agents/**/*.json"]
jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: mizcausevic-dev/agent-card-readme-generator-action@v0.1-shipped
        with:
          card-path: agents/my-agent.json
```

## Inputs

| input            | required | default     | description |
|---|---|---|---|
| `card-path`      | ✓        | —           | Path (relative to repo root) to the AgentCard JSON file. |
| `output-path`    |          | —           | Optional. If set, the rendered Markdown is written to this path. |
| `comment-on-pr`  |          | `auto`      | `auto` posts only on `pull_request` events. |
| `hide-badges`    |          | `false`     | Suppress the trailing badges line under the title. |
| `anchor-prefix`  |          | `section-`  | Anchor prefix for tool / refusal section headings. |
| `github-token`   |          | `${{ github.token }}` | Token for posting the PR comment. |

## Outputs

| output            | description |
|---|---|
| `markdown-length` | Length (in characters) of the rendered Markdown. |
| `output-written`  | `true` iff `output-path` was specified and successfully written. |

## How it composes

- Pair with [`agent-card-diff-action`](https://github.com/mizcausevic-dev/agent-card-diff-action) — diff catches breaking changes, this Action keeps the rendered docs in lockstep.
- Pair with [`agent-card-fleet-summary-action`](https://github.com/mizcausevic-dev/agent-card-fleet-summary-action) — fleet-level audit + per-doc rendered docs.
- Sibling readme-generator actions for the other protocols (forthcoming): `mcp-tool-card-readme-generator-action` · `prompt-provenance-readme-generator-action` · `evidence-bundle-readme-generator-action` · `otel-genai-readme-generator-action`.

## License

[AGPL-3.0-or-later](LICENSE)
