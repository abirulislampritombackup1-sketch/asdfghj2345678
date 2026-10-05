import { useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const NODE_COLORS = {
  room: '#3b82f6',      // Blue
  junction: '#64748b',  // Slate gray
  exit: '#10b981',      // Emerald green
};

const NODE_STROKES = {
  room: '#1d4ed8',
  junction: '#334155',
  exit: '#047857',
};

const BLOCKED_COLOR = '#ef4444';
const BLOCKED_STROKE = '#b91c1c';
const ROUTE_COLOR = '#f59e0b';
const START_COLOR = '#8b5cf6';
const NODE_RADIUS = 24;

export default function GraphCanvas({
  nodes = [],
  edges = [],
  blockedNodes = new Set(),
  blockedEdges = new Set(),
  closedExits = new Set(),
  startNode = null,
  route = null,
  onNodeClick,
  onNodeRightClick,
  onEdgeRightClick,
  activeStepNode = null
}) {
  const { t } = useLanguage();
  const svgRef = useRef(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  if (!nodes || nodes.length === 0) {
    return (
      <div className="svg-container" style={{ minHeight: '400px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t('noFileLoaded')}</p>
      </div>
    );
  }

  // Lookup map
  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  // Route nodes and directed edges
  const routeNodeSet = new Set(route?.path || []);
  const routeEdgeMap = new Map(); // "u:::v" -> direction { from, to }
  if (route?.path) {
    for (let i = 0; i < route.path.length - 1; i++) {
      const u = route.path[i];
      const v = route.path[i + 1];
      const key = [u, v].sort().join(':::');
      routeEdgeMap.set(key, { from: u, to: v, step: i + 1 });
    }
  }

  // Calculate dynamic bounding box with generous padding
  const xs = nodes.map(n => n.x);
  const ys = nodes.map(n => n.y);
  const paddingX = 110;
  const paddingY = 90;
  const minX = Math.min(...xs) - paddingX;
  const minY = Math.min(...ys) - paddingY;
  const maxX = Math.max(...xs) + paddingX;
  const maxY = Math.max(...ys) + paddingY;
  const width = Math.max(maxX - minX, 600);
  const height = Math.max(maxY - minY, 400);

  return (
    <div className="svg-container">
      <svg
        ref={svgRef}
        viewBox={`${minX} ${minY} ${width} ${height}`}
        style={{ width: '100%', height: '100%', maxHeight: '680px', overflow: 'visible' }}
        onContextMenu={(e) => e.preventDefault()}
        aria-label="Building Evacuation Floor Map"
      >
        <defs>
          {/* Arrowhead marker for evacuation path direction */}
          <marker
            id="route-arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
          </marker>

          {/* Gradients */}
          <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          <filter id="glow-route" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="node-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* 1. Edges / Corridors */}
        <g className="edges-layer">
          {edges.map(edge => {
            const from = nodeMap[edge.from];
            const to = nodeMap[edge.to];
            if (!from || !to) return null;

            const isBlockedEdge = blockedEdges.has(edge.id);
            const isBlockedEndpoint = blockedNodes.has(edge.from) || blockedNodes.has(edge.to);
            const isBlocked = isBlockedEdge || isBlockedEndpoint;

            const pairKey = [edge.from, edge.to].sort().join(':::');
            const onRouteInfo = routeEdgeMap.get(pairKey);
            const onRoute = Boolean(onRouteInfo);

            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;

            // Determine line coords with route direction if applicable
            let x1 = from.x, y1 = from.y, x2 = to.x, y2 = to.y;
            if (onRoute && onRouteInfo.from === to.id) {
              // Orient edge in route direction
              x1 = to.x; y1 = to.y; x2 = from.x; y2 = from.y;
            }

            return (
              <g
                key={edge.id}
                className="svg-edge-group"
                onClick={(e) => {
                  if (e.shiftKey) {
                    onEdgeRightClick(edge.id);
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onEdgeRightClick(edge.id);
                }}
                onMouseEnter={() => setHoveredItem({ type: 'edge', id: edge.id, cost: edge.cost, isBlocked, from: edge.from, to: edge.to })}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Invisible fat hit area for easy clicking */}
                <line
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke="transparent" strokeWidth="18"
                  style={{ cursor: 'pointer' }}
                />

                {/* Visible corridor line */}
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  className={`svg-edge ${onRoute ? 'svg-edge-route' : ''} ${isBlocked ? 'svg-edge-blocked' : ''}`}
                  stroke={isBlocked ? BLOCKED_COLOR : onRoute ? 'url(#route-gradient)' : 'var(--edge-default)'}
                  strokeWidth={onRoute ? 5 : 2.5}
                  strokeDasharray={isBlocked ? '8 5' : 'none'}
                  filter={onRoute ? 'url(#glow-route)' : 'none'}
                  style={{ transition: 'all 0.3s ease' }}
                />

                {/* Animated directional indicator on active route */}
                {onRoute && !isBlocked && (
                  <circle r="4" fill="#fbbf24">
                    <animateMotion
                      path={`M ${x1} ${y1} L ${x2} ${y2}`}
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Corridor cost pill */}
                <g
                  transform={`translate(${midX}, ${midY})`}
                  className="edge-cost-pill"
                >
                  <rect
                    x="-14" y="-10" width="28" height="20" rx="10"
                    fill={isBlocked ? 'var(--hazard-bg)' : onRoute ? '#fef3c7' : 'var(--edge-cost-bg)'}
                    stroke={isBlocked ? BLOCKED_COLOR : onRoute ? '#f59e0b' : 'var(--border-card)'}
                    strokeWidth="1.5"
                    filter="drop-shadow(0 1px 2px rgba(0,0,0,0.1))"
                  />
                  <text
                    x="0" y="3.5"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="800"
                    fill={isBlocked ? BLOCKED_COLOR : onRoute ? '#92400e' : 'var(--edge-cost-text)'}
                    pointerEvents="none"
                    userSelect="none"
                  >
                    {edge.cost}
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        {/* 2. Nodes Layer */}
        <g className="nodes-layer">
          {nodes.map(node => {
            const isBlocked = blockedNodes.has(node.id);
            const isClosed = closedExits.has(node.id);
            const isStart = startNode === node.id;
            const onRoute = routeNodeSet.has(node.id);
            const isStepActive = activeStepNode === node.id;
            const isDisabled = isBlocked || isClosed;

            let fill = NODE_COLORS[node.type] || '#64748b';
            let stroke = NODE_STROKES[node.type] || '#334155';

            if (isDisabled) {
              fill = BLOCKED_COLOR;
              stroke = BLOCKED_STROKE;
            } else if (isStart) {
              fill = START_COLOR;
              stroke = '#4c1d95';
            } else if (onRoute) {
              fill = ROUTE_COLOR;
              stroke = '#b45309';
            }

            const handleClick = (e) => {
              if (e.shiftKey) {
                onNodeRightClick(node.id, node.type);
                return;
              }
              // Normal left click: select start if room or junction and not blocked
              if (node.type !== 'exit' && !isBlocked) {
                onNodeClick(node.id);
              }
            };

            const handleRightClick = (e) => {
              e.preventDefault();
              onNodeRightClick(node.id, node.type);
            };

            return (
              <g
                key={node.id}
                className={`svg-node-group ${isStart ? 'svg-node-start' : ''} ${onRoute ? 'svg-node-route' : ''} ${isDisabled ? 'svg-node-blocked' : ''}`}
                onClick={handleClick}
                onContextMenu={handleRightClick}
                onMouseEnter={() => setHoveredItem({ type: 'node', id: node.id, label: node.label, nodeType: node.type, isBlocked, isClosed, isStart })}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  transform: isStepActive ? 'scale(1.25)' : undefined
                }}
              >
                {/* Pulse ring for active start node */}
                {isStart && (
                  <circle
                    cx={node.x} cy={node.y}
                    r={NODE_RADIUS + 8}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.8"
                  >
                    <animate attributeName="r" values={`${NODE_RADIUS + 4};${NODE_RADIUS + 12};${NODE_RADIUS + 4}`} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Node Shape per PDR spec */}
                {node.type === 'room' && (
                  <circle
                    cx={node.x} cy={node.y}
                    r={NODE_RADIUS}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isStart || onRoute ? 3.5 : 2}
                    filter="url(#node-shadow)"
                    className="svg-node-shape"
                  />
                )}

                {node.type === 'junction' && (
                  <rect
                    x={node.x - NODE_RADIUS * 0.8}
                    y={node.y - NODE_RADIUS * 0.8}
                    width={NODE_RADIUS * 1.6}
                    height={NODE_RADIUS * 1.6}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isStart || onRoute ? 3.5 : 2}
                    transform={`rotate(45 ${node.x} ${node.y})`}
                    filter="url(#node-shadow)"
                    className="svg-node-shape"
                  />
                )}

                {node.type === 'exit' && (
                  <rect
                    x={node.x - NODE_RADIUS * 0.9}
                    y={node.y - NODE_RADIUS * 0.9}
                    width={NODE_RADIUS * 1.8}
                    height={NODE_RADIUS * 1.8}
                    rx="6"
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={onRoute ? 3.5 : 2}
                    filter="url(#node-shadow)"
                    className="svg-node-shape"
                  />
                )}

                {/* Node center icon / id badge */}
                <text
                  x={node.x} y={node.y + 4.5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="13"
                  fontWeight="800"
                  pointerEvents="none"
                  userSelect="none"
                >
                  {isClosed ? '✕' : isBlocked ? '⚠️' : node.id}
                </text>

                {/* Readable Node Label below node */}
                <text
                  x={node.x} y={node.y + NODE_RADIUS + 16}
                  className="node-label-text"
                >
                  {node.label}
                </text>

                {/* State badges (e.g. START or CLOSED) */}
                {isStart && (
                  <g transform={`translate(${node.x}, ${node.y - NODE_RADIUS - 6})`}>
                    <rect x="-24" y="-12" width="48" height="15" rx="7" fill="#6d28d9" />
                    <text x="0" y="-1.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="800">
                      START
                    </text>
                  </g>
                )}

                {isClosed && (
                  <g transform={`translate(${node.x}, ${node.y - NODE_RADIUS - 6})`}>
                    <rect x="-26" y="-12" width="52" height="15" rx="7" fill="#b91c1c" />
                    <text x="0" y="-1.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="800">
                      CLOSED
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Tooltip */}
      {hoveredItem && (
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'var(--bg-card)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-card)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-md)',
            fontSize: '0.78rem',
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          {hoveredItem.type === 'node' ? (
            <span>
              <strong>{hoveredItem.label} ({hoveredItem.id})</strong> • {t(hoveredItem.nodeType)}
              {hoveredItem.isBlocked && ` • ⚠️ ${t('blocked')}`}
              {hoveredItem.isClosed && ` • ✕ ${t('closed')}`}
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                {hoveredItem.nodeType !== 'exit' ? t('clickToBlock') : t('clickToClose')}
              </span>
            </span>
          ) : (
            <span>
              <strong>{hoveredItem.id}</strong> ({hoveredItem.from} ➔ {hoveredItem.to}) • {t('cost')}: {hoveredItem.cost}
              {hoveredItem.isBlocked && ` • ⚠️ ${t('blocked')}`}
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                {t('clickToBlock')}
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
