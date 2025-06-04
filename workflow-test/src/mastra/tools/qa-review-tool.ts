import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { RuntimeContext } from "@mastra/core/runtime-context";

export const qaReviewTool = createTool({
	id: "qa-review-tool",
	description:
		"質問に対してAI Agentが回答し、その回答を別のAI Agentが評価するワークフローを実行します",
	inputSchema: z.object({
		question: z.string().describe("評価したい質問"),
		// 動的instruction設定のパラメータ（オプション）
		answeringStyle: z
			.enum(["brief", "detailed", "structured"])
			.optional()
			.describe("回答スタイル"),
		expertiseLevel: z
			.enum(["beginner", "intermediate", "expert", "general"])
			.optional()
			.describe("専門性レベル"),
		tone: z
			.enum(["friendly", "professional", "casual", "polite"])
			.optional()
			.describe("回答のトーン"),
		reviewStyle: z
			.enum(["constructive", "critical", "balanced", "encouraging"])
			.optional()
			.describe("評価スタイル"),
		evaluationCriteria: z
			.enum([
				"accuracy",
				"clarity",
				"completeness",
				"comprehensive",
				"usefulness",
			])
			.optional()
			.describe("評価基準"),
		reviewTone: z
			.enum(["supportive", "analytical", "mentoring", "professional"])
			.optional()
			.describe("評価のトーン"),
		detailLevel: z
			.enum(["brief", "detailed", "comprehensive"])
			.optional()
			.describe("評価の詳細レベル"),
		language: z
			.string()
			.optional()
			.describe("使用言語（デフォルト：日本語）"),
	}),
	outputSchema: z.object({
		question: z.string(),
		answer: z.string(),
		review: z.string(),
	}),
	execute: async (executeParams) => {
		const { context, mastra } = executeParams;

		if (!mastra) {
			throw new Error("Mastra instance is not available");
		}

		const workflow = mastra.getWorkflow("qaReviewWorkflow");
		if (!workflow) {
			throw new Error("QA Review Workflow not found");
		}

		// RuntimeContextを作成し、動的パラメータを設定
		const runtimeContext = new RuntimeContext();

		// デフォルト値を設定
		runtimeContext.set(
			"answering-style",
			context.answeringStyle || "detailed"
		);
		runtimeContext.set(
			"expertise-level",
			context.expertiseLevel || "general"
		);
		runtimeContext.set("tone", context.tone || "polite");
		runtimeContext.set(
			"review-style",
			context.reviewStyle || "constructive"
		);
		runtimeContext.set(
			"evaluation-criteria",
			context.evaluationCriteria || "comprehensive"
		);
		runtimeContext.set("review-tone", context.reviewTone || "supportive");
		runtimeContext.set("detail-level", context.detailLevel || "detailed");
		runtimeContext.set("language", context.language || "日本語");

		const run = workflow.createRun();
		const result = await run.start({
			inputData: { question: context.question },
			runtimeContext,
		});

		if (result.status === "success") {
			return result.result;
		} else if (result.status === "failed") {
			throw new Error(
				`Workflow execution failed: ${result.error?.message}`
			);
		} else {
			throw new Error(
				`Workflow execution failed with status: ${result.status}`
			);
		}
	},
});
