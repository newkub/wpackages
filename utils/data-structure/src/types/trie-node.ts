export class TrieNode {
  public readonly children: ReadonlyMap<string, TrieNode>;
  public readonly isEndOfWord: boolean;

  constructor(
    children: ReadonlyMap<string, TrieNode> = new Map(),
    isEndOfWord = false,
  ) {
    this.children = children;
    this.isEndOfWord = isEndOfWord;
  }
}
