import { type Graph } from '@wpackages/data-structure';

export function depthFirstSearch<T>(graph: Graph<T>, startNode: T): T[] {
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
}