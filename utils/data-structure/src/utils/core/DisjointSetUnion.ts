export interface DSU<T> {
  readonly parent: Map<T, T>;
  readonly rank: Map<T, number>;
}

export const createDSU = <T>(vertices: T[]): DSU<T> => {
  const parent = new Map<T, T>();
  const rank = new Map<T, number>();
  for (const vertex of vertices) {
    parent.set(vertex, vertex);
    rank.set(vertex, 0);
  }
  return { parent, rank };
};

// Find operation with path compression
export const find = <T>(dsu: DSU<T>, vertex: T): T | undefined => {
  const parentVertex = dsu.parent.get(vertex);
  if (parentVertex === undefined) {
    return undefined; // Vertex not in DSU
  }
  if (parentVertex === vertex) {
    return vertex;
  }
  const root = find(dsu, parentVertex);
  if (root !== undefined) {
    dsu.parent.set(vertex, root); // Path compression
  }
  return root;
};

// Union operation by rank
export const union = <T>(dsu: DSU<T>, v1: T, v2: T): void => {
  const root1 = find(dsu, v1);
  const root2 = find(dsu, v2);

  if (root1 === undefined || root2 === undefined || root1 === root2) {
    return;
  }

  const rank1 = dsu.rank.get(root1) ?? 0;
  const rank2 = dsu.rank.get(root2) ?? 0;

  if (rank1 > rank2) {
    dsu.parent.set(root2, root1);
  } else if (rank1 < rank2) {
    dsu.parent.set(root1, root2);
  } else {
    dsu.parent.set(root2, root1);
    dsu.rank.set(root1, rank1 + 1);
  }
};
