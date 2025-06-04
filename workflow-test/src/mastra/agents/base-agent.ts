import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { braveSearchMcp } from "../mcp-client";

export const baseAgent = new Agent({
	name: "Base_Agent",
	// instructions: async ({ runtimeContext }) => {
	// 	// ワークフロー画面から設定されるinstructionを取得
	// 	const customInstruction =
	// 		runtimeContext.get("agent-instruction") ||
	// 		"あなたは親切で知識豊富なアシスタントです。質問に対して適切に回答してください。";

	// 	// エージェント呼び出し情報をruntimeContextに保存
	// 	runtimeContext.set("last-agent-called", "Base_Agent");
	// 	runtimeContext.set("agent-call-timestamp", new Date().toISOString());

	// 	return customInstruction as string;
	// },
	instructions: `あなたは親切で知識豊富なアシスタントです。質問に対して適切に回答してください。`,
	model: google("gemini-2.0-flash-exp"),
	tools: await braveSearchMcp.getTools(),
	defaultGenerateOptions: { maxSteps: 10 },
});
