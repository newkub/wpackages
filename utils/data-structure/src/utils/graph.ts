// --- Common Types ---
export interface AdjacencyNode<T> {
	readonly node: T;
	readonly weight: number;
}

// --- Unweighted Graph ---
export type Graph<T> = ReadonlyMap<T, readonly T[]>;

export const createGraph = <T>(): Graph<T> => new Map();

export const addVertex = <T>(graph: Graph<T>, vertex: T): Graph<T> => {
	if (graph.has(vertex)) {
		return graph;
	}
	const newGraph = new Map(graph);
	newGraph.set(vertex, []);
	return newGraph;
};

export const addEdge = <T>(graph: Graph<T>, v1: T, v2: T): Graph<T> => {
	if (!graph.has(v1) || !graph.has(v2)) {
		throw new Error("One or both vertices not found in the graph.");
	}
	const newGraph = new Map(graph);
	const v1Neighbors = [...(newGraph.get(v1) || [])];
	const v2Neighbors = [...(newGraph.get(v2) || [])];

	newGraph.set(v1, [...v1Neighbors, v2]);
	newGraph.set(v2, [...v2Neighbors, v1]);

	return newGraph;
};

export const getNeighbors = <T>(graph: Graph<T>, vertex: T): readonly T[] | undefined => {
	return graph.get(vertex);
};

export const bfs = <T>(graph: Graph<T>, startNode: T): T[] => {
	if (!graph.has(startNode)) {
		return [];
	}

	const visited = new Set<T>();
	const queue: T[] = [startNode];
	const result: T[] = [];
	visited.add(startNode);

	while (queue.length > 0) {
		const currentNode = queue.shift()!;
		result.push(currentNode);

		const neighbors = graph.get(currentNode) || [];
		for (const neighbor of neighbors) {
			if (!visited.has(neighbor)) {
				visited.add(neighbor);
				queue.push(neighbor);
			}
		}
	}
	return result;
};

export const dfs = <T>(graph: Graph<T>, startNode: T): T[] => {
	if (!graph.has(startNode)) {
		return [];
	}

	const visited = new Set<T>();
	const result: T[] = [];

	const dfsRecursive = (vertex: T) => {
		visited.add(vertex);
		result.push(vertex);
		const neighbors = graph.get(vertex) || [];
		for (const neighbor of neighbors) {
			if (!visited.has(neighbor)) {
				dfsRecursive(neighbor);
			}
		}
	};

	dfsRecursive(startNode);
	return result;
};

// --- Weighted Graph ---
export type WeightedGraph<T> = ReadonlyMap<T, readonly AdjacencyNode<T>[]>;

export const createWeightedGraph = <T>(): WeightedGraph<T> => new Map();

export const addWeightedVertex = <T>(
	graph: WeightedGraph<T>,
	vertex: T,
): WeightedGraph<T> => {
	if (graph.has(vertex)) {
		return graph;
	}
	const newGraph = new Map(graph);
	newGraph.set(vertex, []);
	return newGraph;
};

export const addWeightedEdge = <T>(
	graph: WeightedGraph<T>,
	v1: T,
	v2: T,
	weight: number,
): WeightedGraph<T> => {
	if (!graph.has(v1) || !graph.has(v2)) {
		throw new Error("One or both vertices not found in the graph.");
	}
	const newGraph = new Map(graph);
	const v1Neighbors = [...(newGraph.get(v1) || [])];
	const v2Neighbors = [...(newGraph.get(v2) || [])];

	newGraph.set(v1, [...v1Neighbors, { node: v2, weight }]);
	newGraph.set(v2, [...v2Neighbors, { node: v1, weight }]);

	return newGraph;
};
