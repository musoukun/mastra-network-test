import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { mastraLogger } from "./logger-config";
import { braveSearchMcp } from "./mcp-client";

import { weatherAgent } from "./agents/weather-agent";
import { answerAgent } from "./agents/answer-agent";
// import { reviewerAgent } from "./agents/reviewer-agent";
import { qaAssistantAgent } from "./agents/qa-assistant-agent";
import { baseAgent } from "./agents/base-agent";
import { thinkingAgent } from "./agents/thinking-agent";
// import { questionerAgent } from "./agents/questioner-agent";
// import { conversationEvaluatorAgent } from "./agents/conversation-evaluator-agent";
import { qaReviewWorkflow } from "./workflows/qa-review-workflow";
import { multiAgentConversationWorkflow } from "./workflows/multi-agent-conversation-workflow";
import { multiAgentNetwork } from "./networks/agent-network";

export const mastra = new Mastra({
	agents: {
		weatherAgent,
		baseAgent,
		thinkingAgent,
		answerAgent,
		qaAssistantAgent,
	},
	networks: {
		multiAgentNetwork,
	},
	workflows: {
		qaReviewWorkflow,
		multiAgentConversationWorkflow,
	},

	storage: new LibSQLStore({
		// stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
		url: "file:../mastra.db",
	}),
	logger: mastraLogger,
});
