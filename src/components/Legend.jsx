import { useLanguage } from '../i18n/LanguageContext';

export default function Legend() {
  const { t } = useLanguage();

  return (
    <div className="panel-card legend-card">
      <div style={{ fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>🗺️</span>
        <span>{t('legend')}</span>
      </div>

      <div className="legend-grid">
        <div className="legend-item">
          <span className="legend-swatch" style={{ background: 'var(--node-room)', borderRadius: '50%' }}></span>
          <span>{t('room')} (●)</span>
        </div>

        <div className="legend-item">
          <span
            className="legend-swatch"
            style={{ background: 'var(--node-junction)', transform: 'rotate(45deg)' }}
          ></span>
          <span>{t('junction')} (◆)</span>
        </div>

        <div className="legend-item">
          <span className="legend-swatch" style={{ background: 'var(--node-exit)', borderRadius: '2px' }}></span>
          <span>{t('exit')} (■)</span>
        </div>

        <div className="legend-item">
          <span className="legend-swatch" style={{ background: 'var(--start-node)', borderRadius: '50%' }}></span>
          <span>{t('startLabel')}</span>
        </div>

        <div className="legend-item">
          <span className="legend-swatch" style={{ background: 'var(--route-primary)' }}></span>
          <span>{t('routeSequence')}</span>
        </div>

        <div className="legend-item">
          <span className="legend-swatch" style={{ background: 'var(--hazard-blocked)', borderRadius: '50%' }}></span>
          <span>{t('blocked')} (🔴)</span>
        </div>

        <div className="legend-item">
          <span className="legend-swatch" style={{ background: 'var(--hazard-blocked)', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 'bold' }}>✕</span>
          <span>{t('closed')}</span>
        </div>

        <div className="legend-item">
          <span style={{ display: 'inline-block', width: '16px', height: '0', borderTop: '2px dashed var(--hazard-blocked)' }}></span>
          <span>{t('corridor')} ({t('blocked')})</span>
        </div>
      </div>
    </div>
  );
}
