import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from './i18n/LanguageContext';
import LanguageSwitch from './components/LanguageSwitch';
import FileImport from './components/FileImport';
import GraphCanvas from './components/GraphCanvas';
import RoutePanel from './components/RoutePanel';
import HazardControls from './components/HazardControls';
import Legend from './components/Legend';
import { validateBuildingData } from './utils/graphValidator';
import { findShortestPath, findKShortestPaths } from './utils/dijkstra';

// Embedded fallback sample in case fetch is delayed
const DEFAULT_SAMPLE_BUILDING = {
  building: "DIU Academic Complex — Floor 2",
  nodes: [
    { id: "R1", label: "Room 101 (R1)", type: "room", x: 120, y: 140 },
    { id: "C1", label: "Junction C1", type: "junction", x: 280, y: 140 },
    { id: "C2", label: "Junction C2", type: "junction", x: 460, y: 140 },
    { id: "E1", label: "North Exit (E1)", type: "exit", x: 640, y: 140 },
    { id: "R2", label: "Room 102 (R2)", type: "room", x: 120, y: 310 },
    { id: "C3", label: "Junction C3", type: "junction", x: 280, y: 310 },
    { id: "C4", label: "Junction C4", type: "junction", x: 460, y: 310 },
    { id: "E2", label: "South Exit (E2)", type: "exit", x: 640, y: 310 }
  ],
  edges: [
    { id: "e_r1_c1", from: "R1", to: "C1", cost: 2 },
    { id: "e_c1_c2", from: "C1", to: "C2", cost: 2 },
    { id: "e_c2_e1", from: "C2", to: "E1", cost: 3 },
    { id: "e_c1_c3", from: "C1", to: "C3", cost: 4 },
    { id: "e_r2_c3", from: "R2", to: "C3", cost: 2 },
    { id: "e_c3_c4", from: "C3", to: "C4", cost: 2 },
    { id: "e_c4_e2", from: "C4", to: "E2", cost: 3 }
  ],
  initial_state: {
    blocked_nodes: [],
    blocked_edges: [],
    closed_exits: []
  }
};

export default function App() {
  const { t } = useLanguage();

  // Core Building Data State - initialized synchronously with sample data for instant render
  const [originalData, setOriginalData] = useState(DEFAULT_SAMPLE_BUILDING);
  const [buildingName, setBuildingName] = useState(DEFAULT_SAMPLE_BUILDING.building);
  const [nodes, setNodes] = useState(DEFAULT_SAMPLE_BUILDING.nodes);
  const [edges, setEdges] = useState(DEFAULT_SAMPLE_BUILDING.edges);

  // URL query parameter support for direct scenario reproduction and testing
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialBlockedFromUrl = searchParams?.get('blocked') ? searchParams.get('blocked').split(',').map(s => s.trim()) : null;
  const initialClosedFromUrl = searchParams?.get('closed') ? searchParams.get('closed').split(',').map(s => s.trim()) : null;
  const initialStartFromUrl = searchParams?.get('start') || 'R1';

  // Hazard State
  const [blockedNodes, setBlockedNodes] = useState(
    () => new Set(initialBlockedFromUrl || DEFAULT_SAMPLE_BUILDING.initial_state.blocked_nodes)
  );
  const [blockedEdges, setBlockedEdges] = useState(new Set(DEFAULT_SAMPLE_BUILDING.initial_state.blocked_edges));
  const [closedExits, setClosedExits] = useState(
    () => new Set(initialClosedFromUrl || DEFAULT_SAMPLE_BUILDING.initial_state.closed_exits)
  );

  // Routing State
  const [startNode, setStartNode] = useState(initialStartFromUrl);
  const [route, setRoute] = useState(() => {
    const bNodes = new Set(initialBlockedFromUrl || DEFAULT_SAMPLE_BUILDING.initial_state.blocked_nodes);
    const cExits = new Set(initialClosedFromUrl || DEFAULT_SAMPLE_BUILDING.initial_state.closed_exits);
    return findShortestPath(DEFAULT_SAMPLE_BUILDING.nodes, DEFAULT_SAMPLE_BUILDING.edges, initialStartFromUrl, bNodes, new Set(), cExits);
  });
  const [alternativeRoutes, setAlternativeRoutes] = useState(() => {
    const bNodes = new Set(initialBlockedFromUrl || DEFAULT_SAMPLE_BUILDING.initial_state.blocked_nodes);
    const cExits = new Set(initialClosedFromUrl || DEFAULT_SAMPLE_BUILDING.initial_state.closed_exits);
    return findKShortestPaths(DEFAULT_SAMPLE_BUILDING.nodes, DEFAULT_SAMPLE_BUILDING.edges, initialStartFromUrl, bNodes, new Set(), cExits, 3);
  });
  const [routeStatus, setRouteStatus] = useState(() => {
    const bNodes = new Set(initialBlockedFromUrl || DEFAULT_SAMPLE_BUILDING.initial_state.blocked_nodes);
    const cExits = new Set(initialClosedFromUrl || DEFAULT_SAMPLE_BUILDING.initial_state.closed_exits);
    if (!initialStartFromUrl) return 'no_start';
    if (bNodes.has(initialStartFromUrl)) return 'start_blocked';
    const res = findShortestPath(DEFAULT_SAMPLE_BUILDING.nodes, DEFAULT_SAMPLE_BUILDING.edges, initialStartFromUrl, bNodes, new Set(), cExits);
    return res ? 'found' : 'no_route';
  });

  // UI State
  const [fileError, setFileError] = useState(null);
  const [highContrast, setHighContrast] = useState(() => {
    try {
      return localStorage.getItem('theme_contrast') === 'high';
    } catch {
      return false;
    }
  });
  const [activeStepIndex, setActiveStepIndex] = useState(null);

  // Apply high contrast class to body
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    try {
      localStorage.setItem('theme_contrast', highContrast ? 'high' : 'normal');
    } catch (e) {
      console.warn(e);
    }
  }, [highContrast]);

  // Recalculate route helper
  const calculateRoute = useCallback((start, bNodes, bEdges, cExits, currentNodes, currentEdges) => {
    if (!start) {
      setRoute(null);
      setAlternativeRoutes([]);
      setRouteStatus('no_start');
      setActiveStepIndex(null);
      return;
    }

    if (bNodes.has(start)) {
      setRoute(null);
      setAlternativeRoutes([]);
      setRouteStatus('start_blocked');
      setActiveStepIndex(null);
      return;
    }

    const primary = findShortestPath(currentNodes, currentEdges, start, bNodes, bEdges, cExits);
    if (primary) {
      setRoute(primary);
      setRouteStatus('found');
      const alts = findKShortestPaths(currentNodes, currentEdges, start, bNodes, bEdges, cExits, 3);
      setAlternativeRoutes(alts);
    } else {
      setRoute(null);
      setAlternativeRoutes([]);
      setRouteStatus('no_route');
      setActiveStepIndex(null);
    }
  }, []);

  // Load building data and initialize
  const loadBuildingData = useCallback((data, preserveStart = 'R1') => {
    const validation = validateBuildingData(data);
    if (!validation.valid) {
      setFileError(validation.errors.join('; '));
      return false;
    }

    setFileError(null);
    setOriginalData(data);
    setBuildingName(data.building || 'Building Plan');
    setNodes(data.nodes);
    setEdges(data.edges);

    const bNodes = new Set(data.initial_state?.blocked_nodes || []);
    const bEdges = new Set(data.initial_state?.blocked_edges || []);
    const cExits = new Set(data.initial_state?.closed_exits || []);

    setBlockedNodes(bNodes);
    setBlockedEdges(bEdges);
    setClosedExits(cExits);

    const targetStart = preserveStart && data.nodes.some(n => n.id === preserveStart && n.type !== 'exit')
      ? preserveStart
      : (data.nodes.find(n => n.type === 'room')?.id || null);

    setStartNode(targetStart);
    calculateRoute(targetStart, bNodes, bEdges, cExits, data.nodes, data.edges);
    return true;
  }, [calculateRoute]);

  // Handle uploaded file
  const handleFileLoaded = (data, errorMsg) => {
    if (errorMsg) {
      setFileError(errorMsg);
      return;
    }
    loadBuildingData(data, null);
  };

  // Click on node: select start
  const handleNodeClick = (nodeId) => {
    setStartNode(nodeId);
    setActiveStepIndex(null);
    calculateRoute(nodeId, blockedNodes, blockedEdges, closedExits, nodes, edges);
  };

  // Right click / shift click on node: toggle blocked or closed
  const handleNodeToggle = (nodeId, nodeType) => {
    if (nodeType === 'exit') {
      const nextClosed = new Set(closedExits);
      if (nextClosed.has(nodeId)) {
        nextClosed.delete(nodeId);
      } else {
        nextClosed.add(nodeId);
      }
      setClosedExits(nextClosed);
      calculateRoute(startNode, blockedNodes, blockedEdges, nextClosed, nodes, edges);
    } else {
      const nextBlocked = new Set(blockedNodes);
      if (nextBlocked.has(nodeId)) {
        nextBlocked.delete(nodeId);
      } else {
        nextBlocked.add(nodeId);
      }
      setBlockedNodes(nextBlocked);
      calculateRoute(startNode, nextBlocked, blockedEdges, closedExits, nodes, edges);
    }
  };

  // Right click / shift click on edge: toggle blocked
  const handleEdgeToggle = (edgeId) => {
    const nextBlockedEdges = new Set(blockedEdges);
    if (nextBlockedEdges.has(edgeId)) {
      nextBlockedEdges.delete(edgeId);
    } else {
      nextBlockedEdges.add(edgeId);
    }
    setBlockedEdges(nextBlockedEdges);
    calculateRoute(startNode, blockedNodes, nextBlockedEdges, closedExits, nodes, edges);
  };

  // Reset to original initial_state
  const handleReset = () => {
    if (!originalData) return;
    const bNodes = new Set(originalData.initial_state?.blocked_nodes || []);
    const bEdges = new Set(originalData.initial_state?.blocked_edges || []);
    const cExits = new Set(originalData.initial_state?.closed_exits || []);

    setBlockedNodes(bNodes);
    setBlockedEdges(bEdges);
    setClosedExits(cExits);
    setActiveStepIndex(null);
    calculateRoute(startNode, bNodes, bEdges, cExits, nodes, edges);
  };

  // Bonus B1: Save Hazard State to localStorage
  const handleSaveState = () => {
    try {
      const payload = {
        blockedNodes: Array.from(blockedNodes),
        blockedEdges: Array.from(blockedEdges),
        closedExits: Array.from(closedExits),
        startNode
      };
      localStorage.setItem('saved_hazard_state', JSON.stringify(payload));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Bonus B1: Load Hazard State from localStorage
  const handleLoadState = () => {
    try {
      const raw = localStorage.getItem('saved_hazard_state');
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      const bNodes = new Set(parsed.blockedNodes || []);
      const bEdges = new Set(parsed.blockedEdges || []);
      const cExits = new Set(parsed.closedExits || []);
      const sNode = parsed.startNode || startNode;

      setBlockedNodes(bNodes);
      setBlockedEdges(bEdges);
      setClosedExits(cExits);
      setStartNode(sNode);
      calculateRoute(sNode, bNodes, bEdges, cExits, nodes, edges);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Bonus B4: Export SVG as PNG image
  const handleExportPng = () => {
    const svgElem = document.querySelector('svg');
    if (!svgElem) return;

    try {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElem);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width || 1200;
        canvas.height = image.height || 800;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = highContrast ? '#0f172a' : '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `evacuation-map-${startNode || 'overview'}.png`;
        downloadLink.href = pngUrl;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(blobURL);
      };
      image.src = blobURL;
    } catch (e) {
      console.error('PNG export failed:', e);
    }
  };

  const openExitsCount = nodes.filter(n => n.type === 'exit' && !closedExits.has(n.id) && !blockedNodes.has(n.id)).length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-icon">🏃‍♂️</div>
          <div>
            <h1 className="brand-title">{t('appTitle')}</h1>
            <div className="brand-subtitle">{t('appSubtitle')}</div>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={() => setHighContrast(!highContrast)}
            title={highContrast ? t('normalContrast') : t('highContrast')}
          >
            <span>{highContrast ? '☀️' : '🌙'}</span>
            <span>{highContrast ? t('normalContrast') : t('highContrast')}</span>
          </button>

          <button
            type="button"
            className="export-btn"
            onClick={handleExportPng}
            title={t('exportPng')}
          >
            <span>📷</span>
            <span>{t('exportPng')}</span>
          </button>

          <LanguageSwitch />
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="app-main">
        {/* Left: Canvas Area */}
        <section className="canvas-wrapper">
          <div className="canvas-toolbar">
            <div className="building-meta">
              <span className="building-badge">
                🏢 {buildingName}
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {nodes.length} {t('nodesCount')} • {edges.length} {t('edgesCount')} • {openExitsCount} {t('openExitsCount')}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>💡 {t('quickHelp')}</span>
            </div>
          </div>

          <GraphCanvas
            nodes={nodes}
            edges={edges}
            blockedNodes={blockedNodes}
            blockedEdges={blockedEdges}
            closedExits={closedExits}
            startNode={startNode}
            route={route}
            onNodeClick={handleNodeClick}
            onNodeRightClick={handleNodeToggle}
            onEdgeRightClick={handleEdgeToggle}
            activeStepNode={route?.path?.[activeStepIndex] || null}
          />
        </section>

        {/* Right: Side Panel */}
        <aside className="side-panel">
          {/* File Import */}
          <div className="panel-card">
            <FileImport
              onFileLoaded={handleFileLoaded}
              onLoadSample={() => loadBuildingData(DEFAULT_SAMPLE_BUILDING, 'R1')}
            />
            {fileError && (
              <div className="alert-box alert-danger">
                <span>⚠️</span>
                <div>{fileError}</div>
              </div>
            )}
          </div>

          {/* Route Panel */}
          <RoutePanel
            startNode={startNode}
            route={route}
            routeStatus={routeStatus}
            alternativeRoutes={alternativeRoutes}
            nodes={nodes}
            onClearStart={() => handleNodeClick(null)}
            activeStepIndex={activeStepIndex}
            onStepChange={setActiveStepIndex}
          />

          {/* Hazard Controls */}
          <HazardControls
            nodes={nodes}
            edges={edges}
            blockedNodes={blockedNodes}
            blockedEdges={blockedEdges}
            closedExits={closedExits}
            onReset={handleReset}
            onNodeToggle={handleNodeToggle}
            onEdgeToggle={handleEdgeToggle}
            onSaveState={handleSaveState}
            onLoadState={handleLoadState}
          />

          {/* Legend */}
          <Legend />
        </aside>
      </main>

      {/* 3. Footer */}
      <footer className="app-footer">
        <div>
          <strong>Smart Escape</strong> • {t('authorTag')} • AI DevFest 2026 Daffodil International University
        </div>
      </footer>
    </div>
  );
}
