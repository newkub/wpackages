import { TrieNode } from '../types/trie-node';

export type Trie = TrieNode;

export const createTrie = (): Trie => new TrieNode();

const _insert = (node: Trie, word: string): Trie => {
  if (word.length === 0) {
    if (node.isEndOfWord) {
      return node; // No change needed
    }
    return new TrieNode(node.children, true);
  }

  const char = word[0]!;
  const rest = word.substring(1);

  const child = node.children.get(char) ?? createTrie();
  const newChild = _insert(child, rest);

  if (newChild === child) {
    return node; // No change down the path
  }

  const newChildren = new Map(node.children);
  newChildren.set(char, newChild);

  return new TrieNode(newChildren, node.isEndOfWord);
};

export const insert = (trie: Trie, word: string): Trie => {
  if (!word) {
    return trie;
  }
  return _insert(trie, word);
};

const findNode = (trie: Trie, prefix: string): Trie | null => {
  let currentNode = trie;
  for (const char of prefix) {
    const nextNode = currentNode.children.get(char);
    if (!nextNode) {
      return null;
    }
    currentNode = nextNode;
  }
  return currentNode;
};

export const search = (trie: Trie, word: string): boolean => {
  if (!word) {
    return trie.isEndOfWord;
  }
  const node = findNode(trie, word);
  return node?.isEndOfWord ?? false;
};

export const startsWith = (trie: Trie, prefix: string): boolean => {
  if (!prefix) {
    return true;
  }
  return findNode(trie, prefix) !== null;
};
