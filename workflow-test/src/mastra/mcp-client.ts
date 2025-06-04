import { MCPClient } from "@mastra/mcp";

export const braveSearchMcp = new MCPClient({
	servers: {
		"brave-search": {
			command: "npx",
			args: ["-y", "@modelcontextprotocol/server-brave-search"],
			env: {
				BRAVE_API_KEY: process.env.BRAVE_API_KEY || "",
			},
		},
	},
});
