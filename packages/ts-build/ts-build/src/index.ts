import type { BuildOptions } from "bun";

export interface BuilderOptions extends BuildOptions {
	watch?: boolean;
}

export async function createBuilder(options: BuilderOptions) {
	const build = async () => {
		console.log("Building...");
		const result = await Bun.build(options);

		if (!result.success) {
			console.error("Build failed");
			for (const message of result.logs) {
				console.error(message);
			}
		}

		console.log("Build successful!");
	};

	await build();

	if (options.watch) {
		console.log("Watching for changes...");
		// This is a simplified watch mechanism.
		// For a real-world scenario, a more robust file watcher would be used.
		setInterval(build, 5000);
	}
}
