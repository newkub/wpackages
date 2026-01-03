export {
	createPriorityQueue,
	dequeue as pqDequeue,
	enqueue as pqEnqueue,
	isEmpty as pqIsEmpty,
	peek as pqPeek,
	type PriorityQueue,
	size as pqSize,
} from "./PriorityQueue";

export {
	createQueue,
	dequeue as queueDequeue,
	enqueue as queueEnqueue,
	isEmpty as queueIsEmpty,
	peek as queuePeek,
	type Queue,
	size as queueSize,
} from "./Queue";

export {
	createStack,
	isEmpty as stackIsEmpty,
	peek as stackPeek,
	pop as stackPop,
	push as stackPush,
	size as stackSize,
	type Stack,
} from "./Stack";

export * from "./DisjointSetUnion";
