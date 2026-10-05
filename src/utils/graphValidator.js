/**
 * Validates building evacuation graph JSON schema strictly per contest PDR specification.
 *
 * @param {any} data - Parsed JSON object
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateBuildingData(data) {
  const errors = [];

  // 1. Top-level structure validation
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, errors: ['Invalid JSON object: payload must be a JSON object'] };
  }

  if (!data.building || typeof data.building !== 'string' || !data.building.trim()) {
    errors.push('Missing or invalid "building" name (must be a non-empty string)');
  }

  if (!Array.isArray(data.nodes) || data.nodes.length < 2) {
    errors.push('Building must contain at least 2 nodes');
  }

  if (!Array.isArray(data.edges) || data.edges.length < 1) {
    errors.push('Building must contain at least 1 edge (corridor)');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // 2. Node validation
  const nodeIds = new Set();
  const nodeTypes = {};
  let hasRoomOrJunction = false;
  let hasExit = false;

  for (let i = 0; i < data.nodes.length; i++) {
    const node = data.nodes[i];
    const prefix = `Node[${i}]`;

    if (!node || typeof node !== 'object') {
      errors.push(`${prefix} is not a valid object`);
      continue;
    }

    if (!node.id || typeof node.id !== 'string' || !node.id.trim()) {
      errors.push(`${prefix} has missing or empty "id"`);
      continue;
    }

    if (nodeIds.has(node.id)) {
      errors.push(`Duplicate node id "${node.id}" detected`);
    }
    nodeIds.add(node.id);

    if (!node.label || typeof node.label !== 'string' || !node.label.trim()) {
      errors.push(`Node "${node.id}" has missing or empty "label"`);
    }

    if (!['room', 'junction', 'exit'].includes(node.type)) {
      errors.push(`Node "${node.id}" has invalid type "${node.type}". Must be "room", "junction", or "exit"`);
    } else {
      nodeTypes[node.id] = node.type;
      if (node.type === 'room' || node.type === 'junction') {
        hasRoomOrJunction = true;
      }
      if (node.type === 'exit') {
        hasExit = true;
      }
    }

    if (typeof node.x !== 'number' || isNaN(node.x)) {
      errors.push(`Node "${node.id}" has invalid or missing "x" coordinate`);
    }

    if (typeof node.y !== 'number' || isNaN(node.y)) {
      errors.push(`Node "${node.id}" has invalid or missing "y" coordinate`);
    }
  }

  if (!hasRoomOrJunction) {
    errors.push('Building requires at least one startable node (room or junction)');
  }
  if (!hasExit) {
    errors.push('Building requires at least one evacuation "exit" node');
  }

  // 3. Edge validation
  const edgeIds = new Set();
  const edgePairs = new Set();

  for (let i = 0; i < data.edges.length; i++) {
    const edge = data.edges[i];
    const prefix = `Edge[${i}]`;

    if (!edge || typeof edge !== 'object') {
      errors.push(`${prefix} is not a valid object`);
      continue;
    }

    if (!edge.id || typeof edge.id !== 'string' || !edge.id.trim()) {
      errors.push(`${prefix} has missing or empty "id"`);
      continue;
    }

    if (edgeIds.has(edge.id)) {
      errors.push(`Duplicate edge id "${edge.id}" detected`);
    }
    edgeIds.add(edge.id);

    if (!nodeIds.has(edge.from)) {
      errors.push(`Edge "${edge.id}" has unknown "from" node "${edge.from}"`);
    }

    if (!nodeIds.has(edge.to)) {
      errors.push(`Edge "${edge.id}" has unknown "to" node "${edge.to}"`);
    }

    if (edge.from && edge.to && edge.from === edge.to) {
      errors.push(`Edge "${edge.id}" is a self-loop (from "${edge.from}" to itself)`);
    }

    if (edge.from && edge.to) {
      const pairKey = [edge.from, edge.to].sort().join(':::');
      if (edgePairs.has(pairKey)) {
        errors.push(`Duplicate undirected edge connection between "${edge.from}" and "${edge.to}"`);
      }
      edgePairs.add(pairKey);
    }

    if (typeof edge.cost !== 'number' || !Number.isInteger(edge.cost) || edge.cost <= 0) {
      errors.push(`Edge "${edge.id}" cost must be a positive integer (received ${edge.cost})`);
    }
  }

  // 4. initial_state validation
  const state = data.initial_state;
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    errors.push('Missing or invalid "initial_state" object');
  } else {
    if (!Array.isArray(state.blocked_nodes)) {
      errors.push('"initial_state.blocked_nodes" must be an array');
    } else {
      for (const id of state.blocked_nodes) {
        if (!nodeIds.has(id)) {
          errors.push(`initial_state.blocked_nodes references unknown node "${id}"`);
        } else if (nodeTypes[id] === 'exit') {
          errors.push(`initial_state.blocked_nodes includes exit "${id}". Exits must be in closed_exits instead`);
        }
      }
    }

    if (!Array.isArray(state.blocked_edges)) {
      errors.push('"initial_state.blocked_edges" must be an array');
    } else {
      for (const id of state.blocked_edges) {
        if (!edgeIds.has(id)) {
          errors.push(`initial_state.blocked_edges references unknown edge "${id}"`);
        }
      }
    }

    if (!Array.isArray(state.closed_exits)) {
      errors.push('"initial_state.closed_exits" must be an array');
    } else {
      for (const id of state.closed_exits) {
        if (!nodeIds.has(id)) {
          errors.push(`initial_state.closed_exits references unknown node "${id}"`);
        } else if (nodeTypes[id] !== 'exit') {
          errors.push(`initial_state.closed_exits includes "${id}" which is not of type exit`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
