import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";

export const baseAgent = new Agent({
	name: "Base Agent",
	instructions: async ({ runtimeContext }) => {
		// ワークフロー画面から設定されるinstructionを取得
		const customInstruction =
			runtimeContext.get("agent-instruction") ||
			"あなたは親切で知識豊富なアシスタントです。質問に対して適切に回答してください。";

		return customInstruction as string;
	},
	model: google("gemini-2.0-flash-exp"),
});
