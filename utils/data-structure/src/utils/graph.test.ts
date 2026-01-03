import { describe, it, expect } from 'vitest';
import {
  createGraph,
  addVertex,
  addEdge,
  bfs,
  dfs,
  createWeightedGraph,
  addWeightedVertex,
  addWeightedEdge,
} from './graph';

describe('Immutable Unweighted Graph', () => {
  it('should add a vertex immutably', () => {
    const graph0 = createGraph<string>();
    const graph1 = addVertex(graph0, 'A');

    expect(graph0.has('A')).toBe(false);
    expect(graph1.has('A')).toBe(true);
    expect(graph1.get('A')).toEqual([]);
  });

  it('should add an edge immutably', () => {
    const graph0 = addVertex(addVertex(createGraph<string>(), 'A'), 'B');
    const graph1 = addEdge(graph0, 'A', 'B');

    expect(graph0.get('A')).toEqual([]);
    expect(graph0.get('B')).toEqual([]);
    expect(graph1.get('A')).toEqual(['B']);
    expect(graph1.get('B')).toEqual(['A']);
  });

  it('should perform BFS traversal', () => {
    let graph = createGraph<string>();
    graph = addVertex(graph, 'A');
    graph = addVertex(graph, 'B');
    graph = addVertex(graph, 'C');
    graph = addVertex(graph, 'D');
    graph = addEdge(graph, 'A', 'B');
    graph = addEdge(graph, 'A', 'C');
    graph = addEdge(graph, 'B', 'D');

    expect(bfs(graph, 'A')).toEqual(['A', 'B', 'C', 'D']);
  });

  it('should perform DFS traversal', () => {
    let graph = createGraph<string>();
    graph = addVertex(graph, 'A');
    graph = addVertex(graph, 'B');
    graph = addVertex(graph, 'C');
    graph = addVertex(graph, 'D');
    graph = addEdge(graph, 'A', 'B');
    graph = addEdge(graph, 'A', 'C');
    graph = addEdge(graph, 'B', 'D');

    // The exact order can vary in DFS, but this is a common one.
    expect(dfs(graph, 'A')).toEqual(['A', 'B', 'D', 'C']);
  });
});

describe('Immutable Weighted Graph', () => {
  it('should add a weighted edge immutably', () => {
    let graph = createWeightedGraph<string>();
    graph = addWeightedVertex(graph, 'A');
    graph = addWeightedVertex(graph, 'B');
    const newGraph = addWeightedEdge(graph, 'A', 'B', 10);

    expect(graph.get('A')).toEqual([]);
    expect(newGraph.get('A')).toEqual([{ node: 'B', weight: 10 }]);
    expect(newGraph.get('B')).toEqual([{ node: 'A', weight: 10 }]);
  });
});
