import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function HazardControls({
  nodes,
  edges,
  blockedNodes,
  blockedEdges,
  closedExits,
  onReset,
  onNodeToggle,
  onEdgeToggle,
  onSaveState,
  onLoadState
}) {
  const { t } = useLanguage();
  const [feedback, setFeedback] = useState(null);

  const totalHazards = blockedNodes.size + blockedEdges.size + closedExits.size;

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSave = () => {
    if (onSaveState) {
      onSaveState();
      showFeedback(t('stateSaved'));
    }
  };

  const handleLoad = () => {
    if (onLoadState) {
      const success = onLoadState();
      if (success) {
        showFeedback(t('stateLoaded'));
      } else {
        showFeedback(t('noSavedState'));
      }
    }
  };

  return (
    <div className="panel-card hazard-controls-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>⚠️</span>
          <span>{t('activeHazardsCount')}</span>
          <span
            style={{
              background: totalHazards > 0 ? 'var(--hazard-bg)' : 'var(--bg-card-subtle)',
              color: totalHazards > 0 ? 'var(--hazard-blocked)' : 'var(--text-muted)',
              border: `1px solid ${totalHazards > 0 ? 'var(--hazard-border)' : 'var(--border-card)'}`,
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 800
            }}
          >
            {totalHazards}
          </span>
        </div>

        <button
          type="button"
          className="action-btn btn-danger"
          onClick={onReset}
          style={{ padding: '6px 10px', fontSize: '0.8rem' }}
          title={t('reset')}
        >
          🔄 {t('reset')}
        </button>
      </div>

      {feedback && (
        <div className="alert-box alert-info" style={{ padding: '6px 10px', fontSize: '0.78rem' }}>
          <span>🔔</span>
          <div>{feedback}</div>
        </div>
      )}

      {/* Active hazards pill list if any */}
      {totalHazards > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {Array.from(blockedNodes).map(id => (
            <button
              key={id}
              type="button"
              className="action-btn btn-danger"
              style={{ padding: '3px 8px', fontSize: '0.75rem' }}
              onClick={() => {
                const node = nodes.find(n => n.id === id);
                onNodeToggle(id, node?.type || 'room');
              }}
              title={t('unblock')}
            >
              🔴 {id} ✕
            </button>
          ))}

          {Array.from(closedExits).map(id => (
            <button
              key={id}
              type="button"
              className="action-btn btn-danger"
              style={{ padding: '3px 8px', fontSize: '0.75rem' }}
              onClick={() => onNodeToggle(id, 'exit')}
              title={t('openExit')}
            >
              🚪 {id} (Closed) ✕
            </button>
          ))}

          {Array.from(blockedEdges).map(id => (
            <button
              key={id}
              type="button"
              className="action-btn btn-danger"
              style={{ padding: '3px 8px', fontSize: '0.75rem' }}
              onClick={() => onEdgeToggle(id)}
              title={t('unblock')}
            >
              🚧 {id} ✕
            </button>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {t('instructions')}
        </div>
      )}

      {/* Bonus B1: Save / Load state */}
      <div className="btn-grid" style={{ marginTop: '4px' }}>
        <button
          type="button"
          className="action-btn btn-secondary"
          onClick={handleSave}
          title={t('saveState')}
        >
          💾 {t('saveState')}
        </button>
        <button
          type="button"
          className="action-btn btn-secondary"
          onClick={handleLoad}
          title={t('loadState')}
        >
          📂 {t('loadState')}
        </button>
      </div>
    </div>
  );
}
