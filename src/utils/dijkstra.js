/**
 * Dijkstra's algorithm for finding lowest-cost evacuation path to nearest open exit,
 * with contest-specified deterministic tie-breaking:
 * 1. Minimum total cost (sum of edge costs)
 * 2. On cost tie: choose lexicographically smallest exit ID
 * 3. On path tie to the same exit: choose lexicographically smallest node ID sequence (element by element)
 */

/**
 * Compare two path arrays lexicographically element by element
 * @param {string[]} pathA
 * @param {string[]} pathB
 * @returns {number} -1 if A < B, 1 if A > B, 0 if identical
 */
export function comparePaths(pathA, pathB) {
  const minLen = Math.min(pathA.length, pathB.length);
  for (let i = 0; i < minLen; i++) {
    if (pathA[i] < pathB[i]) return -1;
    if (pathA[i] > pathB[i]) return 1;
  }
  return pathA.length - pathB.length;
}

/**
 * Helper to reconstruct path from predecessor mapping
 * @param {Record<string, string>} prev
 * @param {string} target
 * @returns {string[]}
 */
function buildPath(prev, target) {
  const path = [];
  let curr = target;
  const visited = new Set();
  while (curr !== undefined) {
    if (visited.has(curr)) break; // cycle protection
    visited.add(curr);
    path.unshift(curr);
    curr = prev[curr];
  }
  return path;
}

/**
 * Find shortest path from startId to nearest open exit
 *
 * @param {Array<{ id: string, type: string }>} nodes
 * @param {Array<{ id: string, from: string, to: string, cost: number }>} edges
 * @param {string} startId
 * @param {Set<string>} blockedNodes
 * @param {Set<string>} blockedEdges
 * @param {Set<string>} closedExits
 * @returns {{ path: string[], exit: string, cost: number } | null}
 */
export function findShortestPath(nodes, edges, startId, blockedNodes, blockedEdges, closedExits) {
  if (!startId || blockedNodes.has(startId)) {
    return null;
  }

  // 1. Build adjacency list excluding blocked nodes and edges
  const adj = {};
  for (const node of nodes) {
    if (!blockedNodes.has(node.id)) {
      adj[node.id] = [];
    }
  }

  for (const edge of edges) {
    if (blockedEdges.has(edge.id)) continue;
    if (blockedNodes.has(edge.from) || blockedNodes.has(edge.to)) continue;

    // Both endpoints must be valid in adj
    if (adj[edge.from] && adj[edge.to]) {
      adj[edge.from].push({ neighbor: edge.to, cost: edge.cost, edgeId: edge.id });
      adj[edge.to].push({ neighbor: edge.from, cost: edge.cost, edgeId: edge.id });
    }
  }

  // 2. Identify open exits
  const openExits = new Set(
    nodes
      .filter(n => n.type === 'exit' && !closedExits.has(n.id) && !blockedNodes.has(n.id))
      .map(n => n.id)
  );

  if (openExits.size === 0) {
    return null;
  }

  // 3. Dijkstra's Algorithm
  const dist = {};
  const prev = {};
  const visited = new Set();

  for (const id of Object.keys(adj)) {
    dist[id] = Infinity;
  }
  dist[startId] = 0;

  while (true) {
    let current = null;
    let currentDist = Infinity;

    // Pick unvisited node with smallest distance
    // In case of equal distance, sort lexicographically for deterministic order
    for (const id of Object.keys(adj)) {
      if (!visited.has(id)) {
        if (dist[id] < currentDist) {
          currentDist = dist[id];
          current = id;
        } else if (dist[id] === currentDist && dist[id] !== Infinity && current !== null) {
          if (id < current) {
            current = id;
          }
        }
      }
    }

    if (current === null || currentDist === Infinity) break;
    visited.add(current);

    // If current is an exit, we don't explore past the exit (destination reached)
    const isExitNode = nodes.find(n => n.id === current)?.type === 'exit';
    if (isExitNode) {
      continue;
    }

    // Relax neighbors
    const neighbors = adj[current] || [];
    // Sort neighbors by cost, then neighbor id for consistency
    const sortedNeighbors = [...neighbors].sort((a, b) => a.cost - b.cost || (a.neighbor < b.neighbor ? -1 : 1));

    for (const { neighbor, cost } of sortedNeighbors) {
      if (visited.has(neighbor)) continue;

      const alt = dist[current] + cost;
      if (alt < dist[neighbor]) {
        dist[neighbor] = alt;
        prev[neighbor] = current;
      } else if (alt === dist[neighbor]) {
        // Path tie-breaking: prefer lexicographically smaller node sequence
        const existingPath = buildPath(prev, neighbor);
        const candidatePath = buildPath({ ...prev, [neighbor]: current }, neighbor);
        if (comparePaths(candidatePath, existingPath) < 0) {
          prev[neighbor] = current;
        }
      }
    }
  }

  // 4. Select best exit: lowest cost -> lexicographically smallest exit ID
  const sortedExits = [...openExits].sort();
  let bestExit = null;
  let bestCost = Infinity;

  for (const exitId of sortedExits) {
    const cost = dist[exitId];
    if (cost === undefined || cost === Infinity) continue;

    if (cost < bestCost) {
      bestCost = cost;
      bestExit = exitId;
    } else if (cost === bestCost) {
      // If costs are identical, compare exit IDs lexicographically
      if (!bestExit || exitId < bestExit) {
        bestExit = exitId;
      }
    }
  }

  if (!bestExit || bestCost === Infinity) {
    return null;
  }

  // 5. Build and verify final path
  const path = buildPath(prev, bestExit);
  if (path.length === 0 || path[0] !== startId) {
    return null;
  }

  return {
    path,
    exit: bestExit,
    cost: bestCost
  };
}

/**
 * Bonus B3: Find top K alternative evacuation routes
 *
 * @param {Array} nodes
 * @param {Array} edges
 * @param {string} startId
 * @param {Set} blockedNodes
 * @param {Set} blockedEdges
 * @param {Set} closedExits
 * @param {number} k
 * @returns {Array<{ path: string[], exit: string, cost: number, isPrimary: boolean }>}
 */
export function findKShortestPaths(nodes, edges, startId, blockedNodes, blockedEdges, closedExits, k = 3) {
  const primary = findShortestPath(nodes, edges, startId, blockedNodes, blockedEdges, closedExits);
  if (!primary) return [];

  const results = [{ ...primary, isPrimary: true }];
  const pathSet = new Set([primary.path.join('->')]);

  // Try finding alternatives by excluding non-start/non-exit edges from previous paths
  const edgesToTryBlocking = new Set();
  for (let i = 0; i < primary.path.length - 1; i++) {
    const u = primary.path[i];
    const v = primary.path[i + 1];
    const edgeObj = edges.find(e => (e.from === u && e.to === v) || (e.from === v && e.to === u));
    if (edgeObj) edgesToTryBlocking.add(edgeObj.id);
  }

  for (const edgeId of edgesToTryBlocking) {
    if (results.length >= k) break;

    const tempBlockedEdges = new Set(blockedEdges);
    tempBlockedEdges.add(edgeId);

    const alt = findShortestPath(nodes, edges, startId, blockedNodes, tempBlockedEdges, closedExits);
    if (alt) {
      const key = alt.path.join('->');
      if (!pathSet.has(key)) {
        pathSet.add(key);
        results.push({ ...alt, isPrimary: false });
      }
    }
  }

  // Sort alternatives by cost, then lexicographical path
  results.sort((a, b) => a.cost - b.cost || comparePaths(a.path, b.path));
  return results.slice(0, k);
}
