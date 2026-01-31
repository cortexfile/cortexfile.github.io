import React from 'react';
import { useLanguage } from './LanguageContext';
import { translations } from '../utils/translations';

const DebugPanel = () => {
    const { language, dir, t } = useLanguage();

    if (process.env.NODE_ENV === 'production' && !window.location.search.includes('debug')) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '10px',
            left: '10px',
            backgroundColor: 'rgba(0,0,0,0.9)',
            color: '#0f0',
            padding: '10px',
            zIndex: 9999,
            border: '1px solid #0f0',
            fontFamily: 'monospace',
            fontSize: '12px'
        }}>
            <h3>Debug Info</h3>
            <div>Language: <strong>{language}</strong></div>
            <div>Direction: <strong>{dir}</strong></div>
            <div>Test Translation (Hero Title):</div>
            <div style={{ color: 'white' }}>{t('hero.title')}</div>
            <div>Has Translations: {Object.keys(translations).join(', ')}</div>
            <div>Hero Keys: {Object.keys(translations[language]?.hero || {}).join(', ')}</div>
        </div>
    );
};

export default DebugPanel;
