import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

// Agent1とAgent2の会話を実行するステップ
const conversationStep = createStep({
	id: "conversation-step",
	inputSchema: z.object({
		agentInstruction: z.string().describe("Agent1のinstruction"),
		questionInstruction: z.string().describe("Agent2の質問指示"),
		rallyCount: z.number().describe("ラリー数"),
		checkCriteria: z.string().describe("Agent3のチェック基準"),
	}),
	outputSchema: z.object({
		agentInstruction: z.string(),
		questionInstruction: z.string(),
		rallyCount: z.number(),
		checkCriteria: z.string(),
		conversationHistory: z.array(
			z.object({
				role: z.string(),
				content: z.string(),
				agent: z.string(),
			})
		),
	}),
	execute: async ({ inputData, mastra, runtimeContext }) => {
		const {
			agentInstruction,
			questionInstruction,
			rallyCount,
			checkCriteria,
		} = inputData;

		if (!mastra) {
			throw new Error("Mastraインスタンスが初期化されていません");
		}

		// エージェントを取得
		const baseAgent = mastra.getAgent("baseAgent");
		const questionerAgent = mastra.getAgent("questionerAgent");

		if (!baseAgent || !questionerAgent) {
			throw new Error("必要なエージェントが見つかりません");
		}

		// RuntimeContextに設定を追加
		runtimeContext.set("agent-instruction", agentInstruction);
		runtimeContext.set("question-instruction", questionInstruction);
		runtimeContext.set("rally-count", rallyCount.toString());
		runtimeContext.set("check-criteria", checkCriteria);

		const conversationHistory: Array<{
			role: string;
			content: string;
			agent: string;
		}> = [];

		// 初期質問を生成
		let currentContext =
			"会話を開始してください。適切な最初の質問をしてください。";

		for (let i = 0; i < rallyCount; i++) {
			// Agent2（質問者）が質問を生成
			const questionResult = await questionerAgent.generate(
				[
					{
						role: "user",
						content:
							i === 0
								? currentContext
								: `前回の回答: ${conversationHistory[conversationHistory.length - 1]?.content}\n\n次の質問をしてください。（${i + 1}/${rallyCount}回目）`,
					},
				],
				{
					runtimeContext,
				}
			);

			conversationHistory.push({
				role: "user",
				content: questionResult.text,
				agent: "questionerAgent",
			});

			// Agent1（基本エージェント）が回答を生成
			const answerResult = await baseAgent.generate(
				[
					{
						role: "user",
						content: questionResult.text,
					},
				],
				{
					runtimeContext,
				}
			);

			conversationHistory.push({
				role: "assistant",
				content: answerResult.text,
				agent: "baseAgent",
			});
		}

		return {
			agentInstruction,
			questionInstruction,
			rallyCount,
			checkCriteria,
			conversationHistory,
		};
	},
});

// Agent3による会話評価ステップ
const evaluationStep = createStep({
	id: "evaluation-step",
	inputSchema: z.object({
		agentInstruction: z.string(),
		questionInstruction: z.string(),
		rallyCount: z.number(),
		checkCriteria: z.string(),
		conversationHistory: z.array(
			z.object({
				role: z.string(),
				content: z.string(),
				agent: z.string(),
			})
		),
	}),
	outputSchema: z.object({
		agentInstruction: z.string(),
		questionInstruction: z.string(),
		rallyCount: z.number(),
		checkCriteria: z.string(),
		conversationHistory: z.array(
			z.object({
				role: z.string(),
				content: z.string(),
				agent: z.string(),
			})
		),
		evaluation: z.string(),
	}),
	execute: async ({ inputData, mastra, runtimeContext }) => {
		const {
			agentInstruction,
			questionInstruction,
			rallyCount,
			checkCriteria,
			conversationHistory,
		} = inputData;

		if (!mastra) {
			throw new Error("Mastraインスタンスが初期化されていません");
		}

		const evaluatorAgent = mastra.getAgent("conversationEvaluatorAgent");
		if (!evaluatorAgent) {
			throw new Error("Conversation Evaluator Agentが見つかりません");
		}

		// 会話履歴を文字列に変換
		const conversationText = conversationHistory
			.map((entry, index) => {
				const rallyNumber = Math.floor(index / 2) + 1;
				const isQuestion = entry.agent === "questionerAgent";
				return `【ラリー${rallyNumber}${isQuestion ? " - 質問" : " - 回答"}】\n${entry.content}`;
			})
			.join("\n\n");

		const evaluationPrompt = `
以下の会話を評価してください：

【設定情報】
- Agent1の指示: ${agentInstruction}
- 質問指示: ${questionInstruction}
- ラリー数: ${rallyCount}回
- 評価基準: ${checkCriteria}

【会話内容】
${conversationText}

上記の会話について、指定された評価基準に基づいて詳細に評価してください。
`;

		const evaluationResult = await evaluatorAgent.generate(
			[
				{
					role: "user",
					content: evaluationPrompt,
				},
			],
			{
				runtimeContext,
			}
		);

		return {
			agentInstruction,
			questionInstruction,
			rallyCount,
			checkCriteria,
			conversationHistory,
			evaluation: evaluationResult.text,
		};
	},
});

// Multi-Agent Conversation Workflow の定義
export const multiAgentConversationWorkflow = createWorkflow({
	id: "multi-agent-conversation-workflow",
	inputSchema: z.object({
		agentInstruction: z.string().describe("Agent1のinstruction"),
		questionInstruction: z.string().describe("Agent2の質問指示"),
		rallyCount: z.number().describe("ラリー数"),
		checkCriteria: z.string().describe("Agent3のチェック基準"),
	}),
	outputSchema: z.object({
		agentInstruction: z.string(),
		questionInstruction: z.string(),
		rallyCount: z.number(),
		checkCriteria: z.string(),
		conversationHistory: z.array(
			z.object({
				role: z.string(),
				content: z.string(),
				agent: z.string(),
			})
		),
		evaluation: z.string(),
	}),
	steps: [conversationStep, evaluationStep],
})
	.then(conversationStep)
	.then(evaluationStep)
	.commit();
