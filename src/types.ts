// Generate a human-readable Markdown README from an A2A AgentCard JSON.
// Reference: https://github.com/mizcausevic-dev/agent-cards-spec

export type AutonomyLevel = "assistive" | "supervised" | "autonomous";
export type MemoryPersistence = "none" | "session" | "persistent";
export type SideEffectClass = "read" | "mutating" | "external" | "destructive";
export type RefusalBehavior =
  | "refuse_silently"
  | "refuse_and_explain"
  | "escalate_to_human"
  | "redirect_to_alternative";

export interface AgentCard {
  agent_card_version: string;
  agent: {
    id: string;
    name: string;
    version: string;
    provider: string;
    description: string;
    homepage?: string;
  };
  capabilities: {
    primary_purpose: string;
    models_used: Array<{ model: string; role?: string; [key: string]: unknown }>;
    tools: Array<{ name: string; side_effects: SideEffectClass; mcp_tool_card_uri?: string }>;
    max_context_tokens: number;
    memory_persistence: MemoryPersistence;
    autonomy_level: AutonomyLevel;
    prompts_used?: string[];
  };
  refusal_taxonomy?: Array<{ category: string; behavior: RefusalBehavior; example_prompts?: string[] }>;
  evaluations?: Array<{ suite: string; result_uri: string; ran_at: string; passed?: boolean; metrics?: Record<string, unknown> }>;
  deployment: { environment?: string; status?: string; [key: string]: unknown };
  safety_posture: { incident_response_uri?: string; [key: string]: unknown };
}

export interface GenerateOptions {
  /** Suppress the trailing badges line under the title. */
  hideBadges?: boolean;
  /** Anchor prefix for tool / refusal section headings. Default "section-". */
  anchorPrefix?: string;
}
