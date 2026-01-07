// --- Core & Types ---
export {
	createDSU,
	type DSU,
	find as dsuFind,
	union as dsuUnion,
} from "./utils/core/DisjointSetUnion";
export * from "./types/list-node";
export * from "./types/node";
export * from "./types/tree-node";
export * from "./types/trie-node";

// --- Data Structures ---

// Binary Search Tree
export {
	type BinarySearchTree,
	createBinarySearchTree,
	inOrderTraversal,
	insert as bstInsert,
	postOrderTraversal,
	preOrderTraversal,
	remove as bstRemove,
	search as bstSearch,
} from "./utils/binary-search-tree";

// Graph
export {
	addEdge,
	addVertex,
	addWeightedEdge,
	addWeightedVertex,
	type AdjacencyNode,
	bfs,
	createGraph,
	createWeightedGraph,
	dfs,
	getNeighbors,
	type Graph,
	type WeightedGraph,
} from "./utils/graph";

// Heap
export {
	type Comparator,
	createHeap,
	extract as heapExtract,
	type Heap,
	insert as heapInsert,
	isEmpty as heapIsEmpty,
	maxComparator,
	minComparator,
	peek as heapPeek,
	size as heapSize,
} from "./utils/heap";

// Linked List
export {
	append as listAppend,
	createLinkedList,
	getHead as listGetHead,
	getHeadValue as listGetHeadValue,
	type LinkedList,
	prepend as listPrepend,
	removeFirst as listRemoveFirst,
	size as listSize,
	toArray as listToArray,
} from "./utils/linked-list";

// Priority Queue
export {
	createPriorityQueue,
	dequeue as pqDequeue,
	enqueue as pqEnqueue,
	isEmpty as pqIsEmpty,
	peek as pqPeek,
	type PriorityQueue,
	type PriorityQueueElement,
	size as pqSize,
} from "./utils/PriorityQueue";

// Trie
export {
	createTrie,
	insert as trieInsert,
	search as trieSearch,
	startsWith as trieStartsWith,
	type Trie,
} from "./utils/trie";
