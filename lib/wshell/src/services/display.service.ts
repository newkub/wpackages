import { ShellValue } from "@wpackages/command";
import { ConsoleService } from "@wpackages/console";
import { Context, Effect, Layer } from "effect";

export class DisplayService extends Context.Tag("DisplayService")<
	DisplayService,
	{
		readonly display: (value: ShellValue) => Effect.Effect<void, never>;
	}
>() {}

export const DisplayServiceLive = Layer.effect(
	DisplayService,
	Effect.gen(function*() {
		const consoleService = yield* ConsoleService;

		const displayTable = (data: ReadonlyArray<Record<string, any>>) =>
			Effect.sync(() => {
				if (data.length > 0) {
					// Use the built-in console.table for a nicely formatted table.
					console.table(data);
				}
			});

		return DisplayService.of({
			display: (value) =>
				Effect.gen(function*() {
					if (typeof value === "string") {
						yield* consoleService.log(value);
					} else if (value && value.type === "table") {
						yield* displayTable(value.data);
					}
					// If value is void or unhandled, do nothing.
				}),
		});
	}),
);
