import { describe, it, expect } from 'vitest';
import {
  createBinarySearchTree,
  insert,
  search,
  remove,
  inOrderTraversal,
} from './binary-search-tree';

describe('Immutable Binary Search Tree', () => {
  it('should create an empty tree', () => {
    const tree = createBinarySearchTree();
    expect(tree).toBeNull();
  });

  it('should insert values and maintain immutability', () => {
    const tree0 = createBinarySearchTree<number>();
    const tree1 = insert(tree0, 10);
    const tree2 = insert(tree1, 5);
    const tree3 = insert(tree2, 15);

    // Original trees should not be changed
    expect(tree0).toBeNull();
    expect(inOrderTraversal(tree1)).toEqual([10]);
    expect(inOrderTraversal(tree2)).toEqual([5, 10]);
    expect(inOrderTraversal(tree3)).toEqual([5, 10, 15]);
  });

  it('should not change the tree if inserting a duplicate value', () => {
    const tree1 = insert(createBinarySearchTree<number>(), 10);
    const tree2 = insert(tree1, 10);
    expect(tree1).toBe(tree2);
  });

  it('should search for values correctly', () => {
    let tree = createBinarySearchTree<number>();
    tree = insert(tree, 10);
    tree = insert(tree, 5);
    tree = insert(tree, 15);

    expect(search(tree, 10)).toBe(true);
    expect(search(tree, 5)).toBe(true);
    expect(search(tree, 15)).toBe(true);
    expect(search(tree, 99)).toBe(false);
    expect(search(null, 10)).toBe(false);
  });

  it('should remove values and maintain immutability', () => {
    let tree = createBinarySearchTree<number>();
    tree = insert(tree, 10);
    tree = insert(tree, 5);
    tree = insert(tree, 15);
    tree = insert(tree, 12);
    tree = insert(tree, 17);

    const originalTree = tree;

    // Remove leaf node
    const treeAfterRemove5 = remove(tree, 5);
    expect(inOrderTraversal(treeAfterRemove5)).toEqual([10, 12, 15, 17]);
    expect(inOrderTraversal(originalTree)).toEqual([5, 10, 12, 15, 17]);

    // Remove node with one child
    const treeAfterRemove15 = remove(treeAfterRemove5, 15);
    expect(inOrderTraversal(treeAfterRemove15)).toEqual([10, 12, 17]);

    // Remove node with two children (root)
    const treeAfterRemove10 = remove(treeAfterRemove15, 10);
    expect(inOrderTraversal(treeAfterRemove10)).toEqual([12, 17]);
  });

   it('should return the original tree if a value to remove is not found', () => {
    let tree = createBinarySearchTree<number>();
    tree = insert(tree, 10);
    tree = insert(tree, 5);

    const tree2 = remove(tree, 99);
    expect(tree).toBe(tree2);
  });
});
