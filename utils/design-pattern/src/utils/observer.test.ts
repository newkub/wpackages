import { describe, expect, it } from "vitest";
import { Observable } from "./observer";

describe("observer", () => {
	it("should notify listeners", () => {
		const observable = new Observable<string>();
		const results: string[] = [];

		const unsubscribe = observable.subscribe((data) => {
			results.push(data);
		});

		observable.notify("hello");
		observable.notify("world");

		expect(results).toEqual(["hello", "world"]);

		unsubscribe();
		observable.notify("again");

		expect(results).toEqual(["hello", "world"]);
	});
});
