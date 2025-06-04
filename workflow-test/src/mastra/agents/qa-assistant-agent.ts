import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { qaReviewTool } from "../tools/qa-review-tool.js";

export const qaAssistantAgent = new Agent({
	name: "QA Assistant Agent",
	instructions: `あなたは質問に対して詳細な回答と評価を提供するアシスタントです。

利用可能なツール：
- qa-review-tool: 質問に対してAI Agentが回答し、その回答を別のAI Agentが評価します

このツールを使用して：
1. 質問に対して専門的な回答を生成
2. その回答を客観的に評価し改善点を提案
3. ユーザーに分かりやすい形で結果を提示

必要に応じて回答スタイル、専門性レベル、評価基準などを調整してください。

回答形式：
- 質問の内容
- AI Agentの回答
- 評価とフィードバック
- 総合的な見解

常に建設的で有用な情報を提供することを心がけてください。`,
	model: google("gemini-2.0-flash-exp"),
	tools: {
		qaReviewTool,
	},
});
