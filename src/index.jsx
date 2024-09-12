import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './services/i18n';

import './main-styles.css';

const root = createRoot(document.getElementById('appMountPoint'));

root.render(<App />);
