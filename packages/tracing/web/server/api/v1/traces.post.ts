import { ingestSpans } from "../../../../src/tracer";
import type { Span } from "../../../../src/types/tracing";

export default defineEventHandler(async (event) => {
	const spans = await readBody<Span[]>(event);
	await ingestSpans(spans);
	return { status: "ok" };
});
