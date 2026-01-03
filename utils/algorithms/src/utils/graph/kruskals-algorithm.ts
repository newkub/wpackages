import {
  type WeightedGraph,
  createDSU,
  find as dsuFind,
  union as dsuUnion,
} from '@wpackages/data-structure';

interface Edge {
  u: string;
  v: string;
  weight: number;
}

export function kruskalsAlgorithm(graph: WeightedGraph<string>): Edge[] {
  const vertices = Array.from(graph.keys());
  const edges: Edge[] = [];

  // Create a list of all unique edges
  for (const [u, neighbors] of graph.entries()) {
    for (const { node: v, weight } of neighbors) {
      // Avoid duplicate edges in an undirected graph representation
      if (u < v) {
        edges.push({ u, v, weight });
      }
    }
  }

  // Sort edges by weight in ascending order
  edges.sort((a, b) => a.weight - b.weight);

  const dsu = createDSU(vertices);
  const mst: Edge[] = [];

  for (const edge of edges) {
    const { u, v } = edge;
    const rootU = dsuFind(dsu, u);
    const rootV = dsuFind(dsu, v);

    if (rootU !== rootV) {
      mst.push(edge);
      dsuUnion(dsu, u, v);
    }
  }

  return mst;
}
