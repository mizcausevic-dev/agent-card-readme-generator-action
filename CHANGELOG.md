# Changelog

## v0.1.0 — 2026-05-27

- Initial release: GitHub Action wrapping `agent-card-readme-generator` to render a Markdown README from an A2A AgentCard JSON.
- Inputs: `card-path` (required), `output-path` (optional file destination), `comment-on-pr` (auto/true/false), `hide-badges`, `anchor-prefix`, `github-token`.
- Outputs: `markdown-length`, `output-written`.
- Dual-mode: post as PR comment AND/OR write to a target file path — supports both "preview on PR" and "auto-sync docs file" workflows.
- Vendored `generateReadme()` from `agent-card-readme-generator`.
- Composite Node 20 action with `dist/index.js` committed for SHA/tag pinning.
- 13 tests with injected `readFile` / `writeFile` for hermetic execution — covers markdown generation, output-path writes, malformed JSON, PR comment posting, non-PR contexts.
- 1 fixture inherited from `agent-card-readme-generator`.
- **First in the per-protocol readme-generator Action quintet** — sibling to the diff & fleet-summary quintets. Next up: `mcp-tool-card-readme-generator-action`, `prompt-provenance-readme-generator-action`, `evidence-bundle-readme-generator-action`, `otel-genai-readme-generator-action`.
- Node 20/22 CI (lint, typecheck, coverage, build, `npm audit`), AGPL-3.0-or-later, Dependabot.
