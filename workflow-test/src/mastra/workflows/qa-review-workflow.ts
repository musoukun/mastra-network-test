import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

// Agent1の回答ステップ
const answerStep = createStep({
	id: "answer-step",
	inputSchema: z.object({
		question: z.string().describe("評価対象の質問"),
	}),
	outputSchema: z.object({
		question: z.string(),
		answer: z.string(),
	}),
	execute: async ({ inputData, mastra, runtimeContext }) => {
		const { question } = inputData;

		if (!mastra) {
			throw new Error("Mastraインスタンスが初期化されていません");
		}

		const answerAgent = mastra.getAgent("answerAgent");
		if (!answerAgent) {
			throw new Error("Answer Agentが見つかりません");
		}

		const result = await answerAgent.generate(
			[
				{
					role: "user",
					content: question,
				},
			],
			{
				runtimeContext,
			}
		);

		return {
			question,
			answer: result.text,
		};
	},
});

// Agent2の評価ステップ
const reviewStep = createStep({
	id: "review-step",
	inputSchema: z.object({
		question: z.string(),
		answer: z.string(),
	}),
	outputSchema: z.object({
		question: z.string(),
		answer: z.string(),
		review: z.string(),
	}),
	execute: async ({ inputData, mastra, runtimeContext }) => {
		const { question, answer } = inputData;

		if (!mastra) {
			throw new Error("Mastraインスタンスが初期化されていません");
		}

		const reviewerAgent = mastra.getAgent("reviewerAgent");
		if (!reviewerAgent) {
			throw new Error("Reviewer Agentが見つかりません");
		}

		const prompt = `
以下の質問と回答を評価してください：

【質問】
${question}

【回答】
${answer}

上記の回答について、建設的な感想とフィードバックを提供してください。
`;

		const result = await reviewerAgent.generate(
			[
				{
					role: "user",
					content: prompt,
				},
			],
			{
				runtimeContext,
			}
		);

		return {
			question,
			answer,
			review: result.text,
		};
	},
});

// QA Review Workflow の定義
export const qaReviewWorkflow = createWorkflow({
	id: "qa-review-workflow",
	inputSchema: z.object({
		question: z.string().describe("質問"),
	}),
	outputSchema: z.object({
		question: z.string(),
		answer: z.string(),
		review: z.string(),
	}),
	steps: [answerStep, reviewStep],
})
	.then(answerStep)
	.then(reviewStep)
	.commit();
