// IMPORTS

// React
import { useCallback, useEffect } from 'react';

// Misc
import useTheme from 'Helpers/Hooks/useTheme';

// CSS
import themes from 'Styles/Themes';

// IMPLEMENTATIONS

function ApplyTheme() {
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

export default ApplyTheme;
