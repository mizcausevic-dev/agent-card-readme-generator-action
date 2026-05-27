# Security Policy

`agent-card-readme-generator-action` reads the AgentCard JSON file at the workflow's checkout HEAD, renders it into Markdown, optionally writes the result to a target path, and optionally posts a single PR comment via the GitHub API. No remote fetch beyond the GitHub API comment call, no execution of user-supplied code.

The action uses `${{ github.token }}` by default — scoped to the repository where the workflow runs and never persisted. If you provide your own token via the `github-token` input, ensure it has only `pull-requests: write` permissions (and `contents: write` if you use the auto-sync workflow that commits the rendered output back to the repo).

JSON parsing uses `JSON.parse` without `eval` or `Function()`. Malformed AgentCard JSON is caught and the run exits 1 with a clear error.

When `output-path` is provided, parent directories are created as needed via `mkdirSync({ recursive: true })`. The path is taken verbatim from input — the workflow author is responsible for ensuring it stays within the repo.

## Supported versions

Only the latest tagged release is supported.

## Reporting a vulnerability

Please use GitHub Security Advisories for private disclosure:

- [Open a security advisory](https://github.com/mizcausevic-dev/agent-card-readme-generator-action/security/advisories/new)

Do not file public issues for security reports.
