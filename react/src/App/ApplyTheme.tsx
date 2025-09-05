// IMPORTS

// React
import { useCallback, useEffect } from 'react';

// Hooks
import useTheme from 'Helpers/Hooks/useTheme';

// CSS
import themes from 'Styles/Themes';

// IMPLEMENTATIONS

export default function ApplyTheme() {
    const theme = useTheme();

    const updateCSSVariables = useCallback(() => {
        Object.entries(themes[theme]).forEach(([key, value]) => {
            document.documentElement.style.setProperty(`--${key}`, value);
        });
    }, [theme]);

    // On Component Mount and Component Update
    useEffect(() => {
        updateCSSVariables();
    }, [updateCSSVariables, theme]);

    return null;
}
