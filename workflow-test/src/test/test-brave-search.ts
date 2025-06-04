import { mastra } from "./mastra/index.js";
import { braveSearchMcp } from "./mastra/mcp-client.js";
import { baseAgent } from "./mastra/agents/base-agent.js";

async function testBraveSearchMcp() {
	console.log("🔍 Brave Search MCP統合テストを開始します...\n");

	try {
		// MCPツールの取得をテスト
		console.log("📋 1. MCP Toolsの取得テスト");
		console.log("=".repeat(50));

		const tools = await braveSearchMcp.getTools();
		console.log("利用可能なツール:", Object.keys(tools));

		// Base Agentでweb検索のテスト
		console.log("\n📋 2. Base AgentでのWeb検索テスト");
		console.log("=".repeat(50));

		const baseAgentInstance = mastra.getAgent("baseAgent");
		if (!baseAgentInstance) {
			throw new Error("Base Agentが見つかりません");
		}

		const searchQuery = "最新のAI技術の動向について教えて";
		console.log(`検索クエリ: ${searchQuery}`);

		// MCPツールセットを使用して検索
		const toolsets = await braveSearchMcp.getToolsets();
		const result = await baseAgentInstance.generate(
			[{ role: "user", content: searchQuery }],
			{ toolsets }
		);

		console.log("\n🔍 検索結果:");
		console.log(result.text);

		// Agent Networkのテスト
		console.log("\n📋 3. Agent Networkでのルーティングテスト");
		console.log("=".repeat(50));

		const network = mastra.getNetwork("multiAgentNetwork");
		if (!network) {
			throw new Error("Multi Agent Networkが見つかりません");
		}

		const networkQuery = "今日のニュースで話題になっていることは何ですか？";
		console.log(`ネットワーククエリ: ${networkQuery}`);

		// logger情報を確認するため
		const logger = mastra.getLogger();
		logger?.info("Agent Network テスト開始", {
			type: "NETWORK_TEST",
			query: networkQuery,
		});

		const networkResult = await network.generate(networkQuery, {
			toolsets,
		});

		console.log("\n📊 Agent Network結果:");
		console.log(networkResult.text);

		logger?.info("Agent Network テスト完了", {
			type: "NETWORK_TEST",
			result: "success",
		});
	} catch (error) {
		console.error("❌ テスト中にエラーが発生しました:", error);
		const logger = mastra.getLogger();
		logger?.error("Brave Search MCP テストエラー", {
			type: "TEST_ERROR",
			error: error instanceof Error ? error.message : String(error),
		});
	}
}

testBraveSearchMcp();
