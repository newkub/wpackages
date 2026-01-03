import {
  createPriorityQueue,
  pqDequeue,
  pqEnqueue,
  pqIsEmpty,
  type PriorityQueue,
  type WeightedGraph,
} from '@wpackages/data-structure';

interface Edge {
  u: string;
  v: string;
  weight: number;
}

export function primsAlgorithm(
  graph: WeightedGraph<string>,
  startNode: string,
): Edge[] {
  if (!graph.has(startNode)) {
    return [];
  }

  const mst: Edge[] = [];
  const visited = new Set<string>();
  let pq: PriorityQueue<Edge> = createPriorityQueue<Edge>();

  const addEdges = (node: string) => {
    visited.add(node);
    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.node)) {
        pq = pqEnqueue(
          pq,
          { u: node, v: neighbor.node, weight: neighbor.weight },
          neighbor.weight,
        );
      }
    }
  };

  addEdges(startNode);

  while (!pqIsEmpty(pq) && visited.size < graph.size) {
    let minEdge: Edge | null;
    [minEdge, pq] = pqDequeue(pq);

    if (minEdge === null) break;

    const { v: toNode } = minEdge;
    if (visited.has(toNode)) {
      continue;
    }

    mst.push(minEdge);
    addEdges(toNode);
  }

  return mst;
}
