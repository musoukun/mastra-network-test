import { mastra } from "./mastra/index.js";

async function testMultiAgentConversationWorkflow() {
	console.log(
		"🚀 マルチエージェント会話評価ワークフローのテストを開始します...\n"
	);

	try {
		// ワークフローを取得
		const workflow = mastra.getWorkflow("multiAgentConversationWorkflow");
		if (!workflow) {
			throw new Error(
				"Multi-Agent Conversation Workflowが見つかりません"
			);
		}

		// テストケース1: プログラミングに関する会話
		console.log("=".repeat(80));
		console.log(
			"📋 テストケース1: プログラミング学習支援エージェントの評価"
		);
		console.log("=".repeat(80));

		const testCase1 = {
			agentInstruction:
				"あなたはプログラミング初心者を支援する親切な講師です。分かりやすく、段階的に説明することを心がけてください。",
			questionInstruction:
				"プログラミング初心者が理解しやすいように、基礎的な概念から応用まで段階的に質問してください。",
			rallyCount: 3,
			checkCriteria:
				"教育効果、説明の分かりやすさ、段階的な学習サポート、初心者への配慮を重視して評価してください。",
		};

		console.log("📝 設定内容:");
		console.log(`Agent1指示: ${testCase1.agentInstruction}`);
		console.log(`質問指示: ${testCase1.questionInstruction}`);
		console.log(`ラリー数: ${testCase1.rallyCount}回`);
		console.log(`評価基準: ${testCase1.checkCriteria}`);
		console.log("");

		const run1 = workflow.createRun();
		const result1 = await run1.start({
			inputData: testCase1,
		});

		if (result1.status === "success") {
			console.log("💬 会話履歴:");
			result1.result.conversationHistory.forEach((entry, index) => {
				const rallyNumber = Math.floor(index / 2) + 1;
				const isQuestion = entry.agent === "questionerAgent";
				console.log(
					`\n【ラリー${rallyNumber}${isQuestion ? " - 質問" : " - 回答"}】`
				);
				console.log(entry.content);
			});

			console.log("\n📊 評価結果:");
			console.log(result1.result.evaluation);
		}

		// テストケース2: ビジネス相談
		console.log("\n" + "=".repeat(80));
		console.log("📋 テストケース2: ビジネス戦略コンサルタントの評価");
		console.log("=".repeat(80));

		const testCase2 = {
			agentInstruction:
				"あなたは経験豊富なビジネス戦略コンサルタントです。データに基づいた論理的なアドバイスを提供してください。",
			questionInstruction:
				"新規事業の立ち上げに関して、市場分析から実行計画まで体系的に質問してください。",
			rallyCount: 2,
			checkCriteria:
				"論理性、実用性、ビジネス知識の深さ、実行可能性を重視して評価してください。",
		};

		console.log("📝 設定内容:");
		console.log(`Agent1指示: ${testCase2.agentInstruction}`);
		console.log(`質問指示: ${testCase2.questionInstruction}`);
		console.log(`ラリー数: ${testCase2.rallyCount}回`);
		console.log(`評価基準: ${testCase2.checkCriteria}`);
		console.log("");

		const run2 = workflow.createRun();
		const result2 = await run2.start({
			inputData: testCase2,
		});

		if (result2.status === "success") {
			console.log("💬 会話履歴:");
			result2.result.conversationHistory.forEach((entry, index) => {
				const rallyNumber = Math.floor(index / 2) + 1;
				const isQuestion = entry.agent === "questionerAgent";
				console.log(
					`\n【ラリー${rallyNumber}${isQuestion ? " - 質問" : " - 回答"}】`
				);
				console.log(entry.content);
			});

			console.log("\n📊 評価結果:");
			console.log(result2.result.evaluation);
		}

		console.log(
			"\n✅ マルチエージェント会話評価ワークフローのテストが完了しました!"
		);
	} catch (error) {
		console.error("❌ エラーが発生しました:", error);
	}
}

// テストを実行
testMultiAgentConversationWorkflow().catch(console.error);
