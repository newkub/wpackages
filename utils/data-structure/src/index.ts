// --- Core & Types ---
export * from './types/list-node';
export * from './types/node';
export * from './types/trie-node';
export * from './types/tree-node';

// --- Data Structures ---

// Binary Search Tree
export {
  type BinarySearchTree,
  createBinarySearchTree,
  insert as bstInsert,
  remove as bstRemove,
  search as bstSearch,
  inOrderTraversal,
  postOrderTraversal,
  preOrderTraversal,
} from './utils/binary-search-tree';

// Graph
export {
  type Graph, 
  type WeightedGraph,
  type AdjacencyNode,
  createGraph,
  createWeightedGraph,
  addVertex,
  addEdge,
  addWeightedVertex,
  addWeightedEdge,
  getNeighbors,
  bfs,
  dfs,
} from './utils/graph';

// Heap
export {
  type Heap,
  type Comparator,
  createHeap,
  minComparator,
  maxComparator,
  insert as heapInsert,
  extract as heapExtract,
  peek as heapPeek,
  isEmpty as heapIsEmpty,
  size as heapSize,
} from './utils/heap';

// Linked List
export {
  type LinkedList,
  createLinkedList,
  prepend as listPrepend,
  append as listAppend,
  removeFirst as listRemoveFirst,
  toArray as listToArray,
  size as listSize,
  getHead as listGetHead,
  getHeadValue as listGetHeadValue,
} from './utils/linked-list';

// Priority Queue
export {
  type PriorityQueue,
  type PriorityQueueElement,
  createPriorityQueue,
  enqueue as pqEnqueue,
  dequeue as pqDequeue,
  peek as pqPeek,
  isEmpty as pqIsEmpty,
  size as pqSize,
} from './utils/PriorityQueue';

// Trie
export {
  type Trie,
  createTrie,
  insert as trieInsert,
  search as trieSearch,
  startsWith as trieStartsWith,
} from './utils/trie';
