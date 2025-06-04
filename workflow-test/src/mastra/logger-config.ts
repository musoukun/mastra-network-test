import { execSync } from "child_process";
import { PinoLogger } from "@mastra/loggers";

// Windows文字化け対策
if (process.platform === "win32") {
	try {
		// 1. コードページ設定
		execSync("chcp 65001", { stdio: "ignore" });

		// 2. プロセス出力エンコーディング設定
		process.stdout.setEncoding("utf8");
		process.stderr.setEncoding("utf8");

		// 3. 環境変数設定
		process.env.LANG = "ja_JP.UTF-8";
		process.env.LC_ALL = "ja_JP.UTF-8";

		console.log("Windows UTF-8 configuration completed");
	} catch (error) {
		console.warn("Windows UTF-8 configuration failed:", error);
	}
}

// Enhanced Mastra Logger設定
export const createMastraLogger = (
	name: string = "Mastra",
	level: "debug" | "info" | "warn" | "error" = "debug"
) => {
	return new PinoLogger({
		name,
		level,
	});
};

// デフォルトlogger
export const mastraLogger = createMastraLogger("Mastra", "debug");
export const enhancedMastraLogger = createMastraLogger(
	"Enhanced Mastra",
	"debug"
);
