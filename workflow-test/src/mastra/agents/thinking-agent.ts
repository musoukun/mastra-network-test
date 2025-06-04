import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";

export const thinkingAgent = new Agent({
	name: "Thinking_Agent",
	instructions: async ({ runtimeContext }) => {
		// エージェント呼び出し情報をruntimeContextに保存
		runtimeContext.set("last-agent-called", "Thinking_Agent");
		runtimeContext.set("agent-call-timestamp", new Date().toISOString());

		return `あなたは複雑な問題や深い思考が必要なタスクに対応する専門エージェントです。
以下の場合にこのエージェントが使用されます：
- 論理的思考や推論が必要な問題
- 複雑な分析や解説が求められる質問
- 計画立案や戦略的思考が必要なタスク
- 創造的な問題解決が求められる場面

深く考えて、段階的に分析し、論理的で詳細な回答を提供してください。`;
	},
	model: google("gemini-2.0-flash-thinking-exp"),
	defaultGenerateOptions: { maxSteps: 10 },
});
