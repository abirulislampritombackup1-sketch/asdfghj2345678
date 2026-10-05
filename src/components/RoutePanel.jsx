import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function RoutePanel({
  startNode,
  route,
  routeStatus,
  alternativeRoutes = [],
  nodes = [],
  onClearStart,
  activeStepIndex,
  onStepChange
}) {
  const { t } = useLanguage();
  const [showAlternatives, setShowAlternatives] = useState(false);

  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  const startNodeObj = startNode ? nodeMap[startNode] : null;

  return (
    <div className="panel-card route-panel-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🧭</span>
          <span>{t('statusBadge')}</span>
        </div>

        {startNode && (
          <button
            type="button"
            className="action-btn btn-secondary"
            onClick={onClearStart}
            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
          >
            ✕ {t('clearSelection')}
          </button>
        )}
      </div>

      {/* Selected Start Info */}
      {startNode ? (
        <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <strong style={{ color: 'var(--text-muted)' }}>{t('startLabel')}:</strong>
          <span className="node-chip start">
            🟣 {startNodeObj?.label || startNode}
          </span>
        </div>
      ) : (
        <div className="alert-box alert-info">
          <span>ℹ️</span>
          <div>{t('selectStart')}</div>
        </div>
      )}

      {/* Route Found State */}
      {routeStatus === 'found' && route && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="alert-box alert-success">
            <span style={{ fontSize: '18px' }}>✅</span>
            <div>
              <strong style={{ display: 'block' }}>{t('routeFound')}</strong>
              <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                {t('reachExitDesc')}: <strong>{nodeMap[route.exit]?.label || route.exit}</strong>
              </span>
            </div>
          </div>

          {/* Sequence Breadcrumbs */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
              {t('routeSequence')}:
            </div>
            <div className="route-sequence-flow">
              {route.path.map((nodeId, idx) => {
                const isStart = idx === 0;
                const isExit = idx === route.path.length - 1;
                const isCurrentStep = activeStepIndex !== null && activeStepIndex === idx;

                return (
                  <span key={nodeId} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span
                      className={`node-chip ${isStart ? 'start' : isExit ? 'exit' : ''}`}
                      style={{
                        outline: isCurrentStep ? '2px solid var(--primary)' : 'none',
                        transform: isCurrentStep ? 'scale(1.08)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isStart ? '🟣 ' : isExit ? '🟩 ' : '🔹 '}
                      {nodeId}
                    </span>
                    {idx < route.path.length - 1 && (
                      <span className="route-arrow">➔</span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Cost Metric Row */}
          <div className="metric-row">
            <span className="metric-label">{t('totalCost')}:</span>
            <span className="metric-value">{route.cost}</span>
          </div>

          <div className="metric-row">
            <span className="metric-label">{t('exitLabel')}:</span>
            <span className="node-chip exit" style={{ fontSize: '0.85rem' }}>
              🚪 {nodeMap[route.exit]?.label || route.exit}
            </span>
          </div>

          {/* Bonus B5: Step Walkthrough */}
          <div className="walkthrough-bar">
            <div className="walkthrough-step-text">
              {t('stepWalkthrough')}:
              {activeStepIndex !== null ? (
                <span style={{ marginLeft: '6px', color: 'var(--primary)' }}>
                  {t('step')} {activeStepIndex + 1} {t('of')} {route.path.length} ({route.path[activeStepIndex]})
                </span>
              ) : (
                <span style={{ marginLeft: '6px', color: 'var(--text-muted)', fontWeight: 400 }}>
                  ({route.path.length} {t('nodesCount').toLowerCase()})
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                type="button"
                className="action-btn btn-secondary"
                style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                disabled={activeStepIndex === null || activeStepIndex <= 0}
                onClick={() => onStepChange && onStepChange((activeStepIndex || 0) - 1)}
              >
                ◀ {t('prev')}
              </button>
              <button
                type="button"
                className="action-btn btn-primary"
                style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                disabled={activeStepIndex !== null && activeStepIndex >= route.path.length - 1}
                onClick={() => {
                  if (activeStepIndex === null) onStepChange && onStepChange(0);
                  else onStepChange && onStepChange(activeStepIndex + 1);
                }}
              >
                {t('next')} ▶
              </button>
            </div>
          </div>

          {/* Bonus B3: Alternative Routes */}
          {alternativeRoutes.length > 1 && (
            <div style={{ marginTop: '4px' }}>
              <button
                type="button"
                className="action-btn btn-secondary"
                style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'space-between' }}
                onClick={() => setShowAlternatives(!showAlternatives)}
              >
                <span>🔀 {t('alternativeRoutes')} ({alternativeRoutes.length - 1})</span>
                <span>{showAlternatives ? '▲' : '▼'}</span>
              </button>

              {showAlternatives && (
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {alternativeRoutes.slice(1).map((alt, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'var(--bg-card-subtle)',
                        border: '1px solid var(--border-card)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '8px 10px',
                        fontSize: '0.78rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                        <span>{t('alternativeRank')} #{i + 2} (➔ {alt.exit})</span>
                        <span style={{ color: 'var(--primary)' }}>{t('cost')}: {alt.cost}</span>
                      </div>
                      <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                        {alt.path.join(' ➔ ')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Failure Cases */}
      {routeStatus === 'no_route' && (
        <div className="alert-box alert-danger">
          <span style={{ fontSize: '20px' }}>❌</span>
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem' }}>{t('noRoute')}</strong>
            <span style={{ fontSize: '0.8rem' }}>
              All paths to open building exits are currently blocked or disconnected.
            </span>
          </div>
        </div>
      )}

      {routeStatus === 'start_blocked' && (
        <div className="alert-box alert-danger">
          <span style={{ fontSize: '20px' }}>🚫</span>
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem' }}>{t('startBlocked')}</strong>
            <span style={{ fontSize: '0.8rem' }}>
              The selected starting location ({startNode}) is directly impacted by a hazard.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
