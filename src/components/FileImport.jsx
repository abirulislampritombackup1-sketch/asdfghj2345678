import { useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function FileImport({ onFileLoaded, onLoadSample }) {
  const { t } = useLanguage();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        onFileLoaded(parsed, null);
      } catch (err) {
        onFileLoaded(null, `${t('invalidFile')} (${err.message})`);
      }
    };
    reader.onerror = () => {
      onFileLoaded(null, t('invalidFile'));
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
    // Reset file input so re-selecting same file triggers change
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="file-import-container">
      <div
        className={`dropzone ${isDragging ? 'active' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label={t('importFile')}
      >
        <span className="dropzone-icon">📂</span>
        <div className="dropzone-title">{t('importFile')}</div>
        <div className="dropzone-subtitle">{t('dropFileHere')}</div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="file-input-hidden"
          onChange={handleFileChange}
        />
      </div>

      <button
        type="button"
        className="sample-load-btn"
        onClick={onLoadSample}
      >
        <span>🏢</span>
        <span>{t('loadSample')}</span>
      </button>
    </div>
  );
}
