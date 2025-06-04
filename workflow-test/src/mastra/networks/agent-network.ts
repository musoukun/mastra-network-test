import { AgentNetwork } from "@mastra/core/network";
import { google } from "@ai-sdk/google";
import { thinkingAgent } from "../agents/thinking-agent";
import { baseAgent } from "../agents/base-agent";
import { weatherAgent } from "../agents/weather-agent";

export const multiAgentNetwork = new AgentNetwork({
	name: "Multi Agent Network",
	model: google("gemini-2.0-flash-exp"),
	agents: [thinkingAgent, baseAgent, weatherAgent],
	instructions: `
ユーザーの質問の内容に応じて、最適なエージェントに振り分けてください。

【エージェント振り分け基準】

1. **Thinking Agent** に振り分ける場合：
   - 複雑な論理的思考や推論が必要な問題
   - 詳細な分析や解説が求められる質問
   - 計画立案や戦略的思考が必要なタスク
   - 創造的な問題解決が求められる場面
   - 「なぜ」「どのように」「分析して」「考えて」などのキーワードを含む質問

2. **Weather Agent** に振り分ける場合：
   - 天気、気象、天候に関する質問
   - 「天気」「気温」「雨」「晴れ」「曇り」「台風」「気候」などのキーワードを含む質問

3. **Base Agent** に振り分ける場合：
   - 上記以外の一般的な質問
   - シンプルな情報提供や挨拶
   - 基本的な事実確認

質問の内容を慎重に分析し、最も適切なエージェントを選択してください。
`,
});
