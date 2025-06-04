import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { weatherTool } from "../tools/weather-tool";
import { AgentNetwork } from "@mastra/core/network";
import { baseAgent } from "./base-agent";
import { thinkingAgent } from "./thinking-agent";

export const weatherAgent = new Agent({
	name: "Weather_Agent",
	instructions: async ({ runtimeContext }) => {
		// エージェント呼び出し情報をruntimeContextに保存
		runtimeContext.set("last-agent-called", "Weather_Agent");
		runtimeContext.set("agent-call-timestamp", new Date().toISOString());

		return `
      You are a helpful weather assistant that provides accurate weather information.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isn't in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative

      Use the weatherTool to fetch current weather data.
`;
	},
	model: google("gemini-1.5-flash"),
	tools: { weatherTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: "file:../mastra.db", // path is relative to the .mastra/output directory
		}),
	}),
	defaultGenerateOptions: { maxSteps: 10 },
});

export const multiAgentNetwork = new AgentNetwork({
	name: "Multi Agent Network",
	model: google("gemini-2.0-flash-exp"),
	agents: [thinkingAgent, baseAgent, weatherAgent],
	instructions: `
天気に関する質問はWeather_Agentに転送してください。
複雑な思考が必要な質問はThinking_Agentに転送してください。
それ以外の一般的な質問はBase_Agentに転送してください。
`,
});
