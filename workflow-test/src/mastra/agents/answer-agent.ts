import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";

export const answerAgent = new Agent({
	name: "Answer Agent",
	instructions: async ({ runtimeContext }) => {
		// RuntimeContextから動的パラメータを取得
		const answeringStyle =
			runtimeContext.get("answering-style") || "detailed";
		const expertiseLevel =
			runtimeContext.get("expertise-level") || "general";
		const language = runtimeContext.get("language") || "日本語";
		const tone = runtimeContext.get("tone") || "polite";

		let baseInstructions = `あなたは質問に対して正確な回答を提供するアシスタントです。`;

		// 回答スタイルに基づく指示
		switch (answeringStyle) {
			case "brief":
				baseInstructions += `\n\n回答スタイル: 簡潔で要点を絞った回答を提供してください。`;
				break;
			case "detailed":
				baseInstructions += `\n\n回答スタイル: 詳細で包括的な回答を提供してください。例や説明を豊富に含めてください。`;
				break;
			case "structured":
				baseInstructions += `\n\n回答スタイル: 構造化された論理的な回答を提供してください。番号付きリストや見出しを使用してください。`;
				break;
		}

		// 専門性レベルに基づく指示
		switch (expertiseLevel) {
			case "beginner":
				baseInstructions += `\n\n対象者: 初心者向けに、専門用語を避けて分かりやすく説明してください。`;
				break;
			case "intermediate":
				baseInstructions += `\n\n対象者: 中級者向けに、適度な専門用語を使って説明してください。`;
				break;
			case "expert":
				baseInstructions += `\n\n対象者: 専門家向けに、高度な概念や専門用語を使って詳細に説明してください。`;
				break;
			case "general":
				baseInstructions += `\n\n対象者: 一般的な知識レベルの人向けに説明してください。`;
				break;
		}

		// トーンに基づく指示
		switch (tone) {
			case "friendly":
				baseInstructions += `\n\nトーン: フレンドリーで親しみやすい口調で回答してください。`;
				break;
			case "professional":
				baseInstructions += `\n\nトーン: プロフェッショナルで丁寧な口調で回答してください。`;
				break;
			case "casual":
				baseInstructions += `\n\nトーン: カジュアルで気軽な口調で回答してください。`;
				break;
			case "polite":
				baseInstructions += `\n\nトーン: 丁寧で敬意を持った口調で回答してください。`;
				break;
		}

		baseInstructions += `\n\n言語: ${language}で回答してください。`;

		baseInstructions += `\n\n回答の際は：
- 質問の内容を理解し、直接的に答える
- 事実に基づいた正確な情報を提供する
- 不明な点があれば素直に認める
- 必要に応じて追加の文脈や背景情報を提供する`;

		return baseInstructions;
	},
	model: google("gemini-2.0-flash-exp"),
});
