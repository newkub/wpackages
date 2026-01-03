import { TreeNode } from "../types/tree-node";

export type BinarySearchTree<T> = TreeNode<T> | null;

export const createBinarySearchTree = <T>(): BinarySearchTree<T> => null;

export const insert = <T>(
	node: BinarySearchTree<T>,
	value: T,
): BinarySearchTree<T> => {
	if (node === null) {
		return new TreeNode(value);
	}

	if (value < node.value) {
		const newLeft = insert(node.left, value);
		if (newLeft === node.left) {
			return node; // No change
		}
		return new TreeNode(node.value, newLeft, node.right);
	} else if (value > node.value) {
		const newRight = insert(node.right, value);
		if (newRight === node.right) {
			return node; // No change
		}
		return new TreeNode(node.value, node.left, newRight);
	} else {
		return node; // Value already exists
	}
};

export const search = <T>(node: BinarySearchTree<T>, value: T): boolean => {
	if (node === null) {
		return false;
	}

	if (value < node.value) {
		return search(node.left, value);
	}

	if (value > node.value) {
		return search(node.right, value);
	}

	return true;
};

const findMinNode = <T>(node: TreeNode<T>): TreeNode<T> => {
	return node.left === null ? node : findMinNode(node.left);
};

export const remove = <T>(
	node: BinarySearchTree<T>,
	value: T,
): BinarySearchTree<T> => {
	if (node === null) {
		return null;
	}

	if (value < node.value) {
		const newLeft = remove(node.left, value);
		if (newLeft === node.left) {
			return node;
		}
		return new TreeNode(node.value, newLeft, node.right);
	} else if (value > node.value) {
		const newRight = remove(node.right, value);
		if (newRight === node.right) {
			return node;
		}
		return new TreeNode(node.value, node.left, newRight);
	} else {
		if (node.left === null) {
			return node.right;
		}
		if (node.right === null) {
			return node.left;
		}

		const minRight = findMinNode(node.right);
		const newRight = remove(node.right, minRight.value);
		return new TreeNode(minRight.value, node.left, newRight);
	}
};

export const inOrderTraversal = <T>(node: BinarySearchTree<T>): T[] => {
	if (node === null) {
		return [];
	}
	const result: T[] = [];
	result.push(...inOrderTraversal(node.left));
	result.push(node.value);
	result.push(...inOrderTraversal(node.right));
	return result;
};

export const preOrderTraversal = <T>(node: BinarySearchTree<T>): T[] => {
	if (node === null) {
		return [];
	}
	const result: T[] = [];
	result.push(node.value);
	result.push(...preOrderTraversal(node.left));
	result.push(...preOrderTraversal(node.right));
	return result;
};

export const postOrderTraversal = <T>(node: BinarySearchTree<T>): T[] => {
	if (node === null) {
		return [];
	}
	const result: T[] = [];
	result.push(...postOrderTraversal(node.left));
	result.push(...postOrderTraversal(node.right));
	result.push(node.value);
	return result;
};
