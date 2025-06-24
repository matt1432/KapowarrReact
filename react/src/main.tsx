import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import Page from './Components/Page/Page';
import ApplyTheme from 'App/ApplyTheme';

import './Styles/globals.css';
import './index.module.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ApplyTheme />
        <Page />
    </StrictMode>,
);
