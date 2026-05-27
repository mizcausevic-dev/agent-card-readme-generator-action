import type { AgentCard, GenerateOptions, SideEffectClass } from "./types.js";

const SIDE_EFFECT_ICON: Record<SideEffectClass, string> = {
  read: "🟢 read",
  mutating: "🟡 mutating",
  external: "🟠 external",
  destructive: "🔴 destructive"
};

const AUTONOMY_BADGE: Record<string, string> = {
  assistive: "⚪ assistive",
  supervised: "🟡 supervised",
  autonomous: "🔴 autonomous"
};

const MEMORY_BADGE: Record<string, string> = {
  none: "⚪ no memory",
  session: "🟡 session memory",
  persistent: "🔴 persistent memory"
};

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function header(card: AgentCard, opts: GenerateOptions): string {
  const lines: string[] = [];
  lines.push(`# ${card.agent.name}`);
  lines.push("");
  lines.push(card.agent.description);
  if (!opts.hideBadges) {
    const badges = [
      AUTONOMY_BADGE[card.capabilities.autonomy_level] ?? card.capabilities.autonomy_level,
      MEMORY_BADGE[card.capabilities.memory_persistence] ?? card.capabilities.memory_persistence,
      `**${card.capabilities.max_context_tokens.toLocaleString()}** context tokens`
    ];
    if (card.safety_posture?.incident_response_uri) badges.push("✅ incident response URI");
    else badges.push("⚠ no incident response URI");
    lines.push("");
    lines.push(badges.join("  ·  "));
  }
  lines.push("");
  lines.push(`**Agent id:** \`${card.agent.id}\` · **Version:** \`${card.agent.version}\` · **Provider:** ${card.agent.provider}`);
  if (card.agent.homepage) lines.push(`**Homepage:** ${card.agent.homepage}`);
  return lines.join("\n");
}

function purpose(card: AgentCard): string {
  return `## Purpose\n\n${card.capabilities.primary_purpose}`;
}

function models(card: AgentCard): string {
  const lines: string[] = [`## Models`, ""];
  if (card.capabilities.models_used.length === 0) {
    lines.push("_No models declared._");
    return lines.join("\n");
  }
  lines.push(`| model | role |`);
  lines.push(`|---|---|`);
  for (const m of card.capabilities.models_used) lines.push(`| \`${m.model}\` | ${m.role ?? "—"} |`);
  return lines.join("\n");
}

function tools(card: AgentCard, anchorPrefix: string): string {
  const lines: string[] = [`## Tools (${card.capabilities.tools.length})`, ""];
  if (card.capabilities.tools.length === 0) {
    lines.push("_No tools declared._");
    return lines.join("\n");
  }
  lines.push(`| name | side effects | tool card |`);
  lines.push(`|---|---|---|`);
  for (const t of card.capabilities.tools) {
    const card_link = t.mcp_tool_card_uri ? `[${t.name}](${t.mcp_tool_card_uri})` : "—";
    lines.push(`| <a id="${anchorPrefix}tool-${slugify(t.name)}"></a>\`${t.name}\` | ${SIDE_EFFECT_ICON[t.side_effects]} | ${card_link} |`);
  }
  return lines.join("\n");
}

function refusals(card: AgentCard): string {
  const cats = card.refusal_taxonomy ?? [];
  const lines: string[] = [`## Refusal taxonomy (${cats.length})`, ""];
  if (cats.length === 0) {
    lines.push("_No refusal categories declared._");
    return lines.join("\n");
  }
  for (const r of cats) {
    lines.push(`### \`${r.category}\` → ${r.behavior}`);
    if (r.example_prompts && r.example_prompts.length > 0) {
      lines.push("");
      for (const ex of r.example_prompts) lines.push(`- "${ex}"`);
    }
    lines.push("");
  }
  return lines.join("\n").trimEnd();
}

function evaluations(card: AgentCard): string {
  const evals = card.evaluations ?? [];
  const lines: string[] = [`## Evaluations (${evals.length})`, ""];
  if (evals.length === 0) {
    lines.push("_No evaluations recorded._");
    return lines.join("\n");
  }
  lines.push(`| suite | passed | ran at | result |`);
  lines.push(`|---|---|---|---|`);
  for (const e of evals) {
    const pass = e.passed === true ? "✅" : e.passed === false ? "❌" : "—";
    const ran = e.ran_at.slice(0, 10);
    lines.push(`| ${e.suite} | ${pass} | ${ran} | [link](${e.result_uri}) |`);
  }
  return lines.join("\n");
}

function deploymentBlock(card: AgentCard): string {
  const d = card.deployment;
  const lines: string[] = [`## Deployment`, ""];
  if (!d || Object.keys(d).length === 0) {
    lines.push("_No deployment metadata._");
    return lines.join("\n");
  }
  for (const [k, v] of Object.entries(d)) {
    lines.push(`- **${k}:** \`${JSON.stringify(v)}\``);
  }
  return lines.join("\n");
}

function safetyPosture(card: AgentCard): string {
  const s = card.safety_posture ?? {};
  const lines: string[] = [`## Safety posture`, ""];
  if (Object.keys(s).length === 0) {
    lines.push("_No safety posture metadata._");
    return lines.join("\n");
  }
  for (const [k, v] of Object.entries(s)) {
    lines.push(`- **${k}:** \`${JSON.stringify(v)}\``);
  }
  return lines.join("\n");
}

export function generateReadme(card: AgentCard, opts: GenerateOptions = {}): string {
  if (!card || !card.agent || !card.capabilities) throw new Error("input must be a valid AgentCard");
  const anchorPrefix = opts.anchorPrefix ?? "section-";
  const sections: string[] = [
    header(card, opts),
    purpose(card),
    models(card),
    tools(card, anchorPrefix),
    refusals(card),
    evaluations(card),
    deploymentBlock(card),
    safetyPosture(card)
  ];
  return sections.join("\n\n").trimEnd() + "\n";
}
