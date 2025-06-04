import { mastra } from "./mastra/index.js";
import { qaReviewTool } from "./mastra/tools/qa-review-tool.js";

async function testQAReviewToolDirect() {
	console.log("🚀 QA Review Tool（直接呼び出し）のテストを開始します...\n");

	try {
		// テストケース1: 基本的な呼び出し
		console.log("=".repeat(60));
		console.log("📋 テストケース1: 基本的なツール呼び出し");
		console.log("=".repeat(60));

		const result1 = await qaReviewTool.execute({
			context: {
				question: "Pythonの主な特徴について教えてください",
			},
			mastra,
		});

		console.log("🔤 質問:", result1.question);
		console.log("\n💬 Agent1の回答:");
		console.log(result1.answer);
		console.log("\n📝 Agent2の評価:");
		console.log(result1.review);

		// テストケース2: カスタマイズされた設定
		console.log("\n" + "=".repeat(60));
		console.log("📋 テストケース2: カスタマイズされた設定");
		console.log("=".repeat(60));

		const result2 = await qaReviewTool.execute({
			context: {
				question: "ディープラーニングとは何ですか？",
				answeringStyle: "structured",
				expertiseLevel: "beginner",
				tone: "friendly",
				reviewStyle: "encouraging",
				evaluationCriteria: "clarity",
				reviewTone: "supportive",
				detailLevel: "brief",
			},
			mastra,
		});

		console.log("🔤 質問:", result2.question);
		console.log("\n💬 Agent1の回答（初心者向け・構造化）:");
		console.log(result2.answer);
		console.log("\n📝 Agent2の評価（励まし・明確性重視）:");
		console.log(result2.review);

		// テストケース3: 専門的な設定
		console.log("\n" + "=".repeat(60));
		console.log("📋 テストケース3: 専門的な設定");
		console.log("=".repeat(60));

		const result3 = await qaReviewTool.execute({
			context: {
				question:
					"確率的勾配降下法のアルゴリズムについて説明してください",
				answeringStyle: "detailed",
				expertiseLevel: "expert",
				tone: "professional",
				reviewStyle: "critical",
				evaluationCriteria: "accuracy",
				reviewTone: "analytical",
				detailLevel: "comprehensive",
			},
			mastra,
		});

		console.log("🔤 質問:", result3.question);
		console.log("\n💬 Agent1の回答（専門家向け・詳細）:");
		console.log(result3.answer);
		console.log("\n📝 Agent2の評価（批判的・正確性重視）:");
		console.log(result3.review);

		console.log(
			"\n✅ QA Review Tool（直接呼び出し）のテストが完了しました!"
		);
	} catch (error) {
		console.error("❌ エラーが発生しました:", error);
	}
}

// テストを実行
testQAReviewToolDirect().catch(console.error);
