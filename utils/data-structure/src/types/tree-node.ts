import { Node } from "./node";

export class TreeNode<T> extends Node<T> {
	public left: TreeNode<T> | null;
	public right: TreeNode<T> | null;

	constructor(
		value: T,
		left: TreeNode<T> | null = null,
		right: TreeNode<T> | null = null,
	) {
		super(value);
		this.left = left;
		this.right = right;
	}
}
