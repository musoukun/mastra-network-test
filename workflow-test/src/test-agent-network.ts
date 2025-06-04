import { mastra } from "./mastra/index.js";

async function testAgentNetwork() {
	console.log("🚀 AgentNetworkのテストを開始します...\n");

	try {
		// ネットワークを取得
		const network = mastra.getNetwork("multiAgentNetwork");
		if (!network) {
			throw new Error("Multi Agent Networkが見つかりません");
		}

		// テストケース1: シンプルな質問（Base Agentに振り分けられるはず）
		console.log("=".repeat(80));
		console.log("📋 テストケース1: シンプルな質問");
		console.log("=".repeat(80));

		const simpleQuestion = "こんにちは！あなたは誰ですか？";
		console.log(`質問: ${simpleQuestion}`);

		const result1 = await network.generate(simpleQuestion);

		console.log(`\n回答: ${result1.text}`);

		// テストケース2: 思考が必要な質問（Thinking Agentに振り分けられるはず）
		console.log("\n" + "=".repeat(80));
		console.log("📋 テストケース2: 複雑な思考が必要な質問");
		console.log("=".repeat(80));

		const thinkingQuestion =
			"なぜAIの発展は人類にとって重要なのか、多角的に分析して説明してください。";
		console.log(`質問: ${thinkingQuestion}`);

		const result2 = await network.generate(thinkingQuestion);

		console.log(`\n回答: ${result2.text}`);

		// テストケース3: 天気に関する質問（Weather Agentに振り分けられるはず）
		console.log("\n" + "=".repeat(80));
		console.log("📋 テストケース3: 天気に関する質問");
		console.log("=".repeat(80));

		const weatherQuestion = "今日の東京の天気はどうですか？";
		console.log(`質問: ${weatherQuestion}`);

		const result3 = await network.generate(weatherQuestion);

		console.log(`\n回答: ${result3.text}`);

		// テストケース4: 創造的思考が必要な質問（Thinking Agentに振り分けられるはず）
		console.log("\n" + "=".repeat(80));
		console.log("📋 テストケース4: 創造的思考が必要な質問");
		console.log("=".repeat(80));

		const creativeQuestion =
			"未来の都市を設計するとしたら、どのような要素を考慮すべきか計画を立ててください。";
		console.log(`質問: ${creativeQuestion}`);

		const result4 = await network.generate(creativeQuestion);

		console.log(`\n回答: ${result4.text}`);

		console.log("\n✅ AgentNetworkのテストが完了しました!");
	} catch (error) {
		console.error("❌ エラーが発生しました:", error);
	}
}

// テストを実行
testAgentNetwork().catch(console.error);
