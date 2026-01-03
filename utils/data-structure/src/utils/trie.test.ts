import { describe, expect, it } from "vitest";
import { createTrie, insert, search, startsWith } from "./trie";

describe("Immutable Trie", () => {
	it("should insert words and maintain immutability", () => {
		const trie0 = createTrie();
		const trie1 = insert(trie0, "hello");
		const trie2 = insert(trie1, "hell");

		// Check original tries are unchanged
		expect(search(trie0, "hello")).toBe(false);
		expect(search(trie1, "hell")).toBe(false);

		// Check new tries have the words
		expect(search(trie2, "hello")).toBe(true);
		expect(search(trie2, "hell")).toBe(true);
	});

	it("should return the same trie if word already exists", () => {
		const trie1 = insert(createTrie(), "word");
		const trie2 = insert(trie1, "word");
		expect(trie1).toBe(trie2);
	});

	it("should correctly search for words", () => {
		let trie = createTrie();
		trie = insert(trie, "apple");
		trie = insert(trie, "app");

		expect(search(trie, "apple")).toBe(true);
		expect(search(trie, "app")).toBe(true);
		expect(search(trie, "ap")).toBe(false);
		expect(search(trie, "apples")).toBe(false);
	});

	it("should correctly check for prefixes", () => {
		let trie = createTrie();
		trie = insert(trie, "apple");

		expect(startsWith(trie, "app")).toBe(true);
		expect(startsWith(trie, "apple")).toBe(true);
		expect(startsWith(trie, "b")).toBe(false);
		expect(startsWith(trie, "apples")).toBe(false);
	});

	it("should handle empty strings", () => {
		const trie = createTrie();
		expect(search(trie, "")).toBe(false);
		expect(startsWith(trie, "")).toBe(true);

		const trieWithEmpty = insert(trie, "");
		// Inserting empty string should not change the trie's end-of-word status at root
		expect(search(trieWithEmpty, "")).toBe(false);
	});
});
