import { AgentNetwork } from "@mastra/core/network";
import { google } from "@ai-sdk/google";
import { thinkingAgent } from "../agents/thinking-agent";
import { baseAgent } from "../agents/base-agent";
import { weatherAgent } from "../agents/weather-agent";

export const multiAgentNetwork = new AgentNetwork({
	name: "Multi Agent Network",
	model: google("gemini-2.5-flash-preview-04-17"),
	agents: [thinkingAgent, baseAgent, weatherAgent],
	instructions: `
天気に関する質問はWeather_Agentに転送してください。
複雑な思考が必要な質問はThinking_Agentに転送してください。
それ以外の一般的な質問はBase_Agentに転送してください。
`,
});
// // Use the network
// const result = await multiAgentNetwork.generate(
// 	"Research the impact of climate change on agriculture"
// );
