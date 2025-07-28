// IMPORTS

// React
import React from 'react';
import { useLocation, useMatch } from 'react-router-dom';

// Redux
import scrollPositions from 'Store/scrollPositions';

// Types
import type { History } from 'history';

interface WrappedComponentProps {
    initialScrollTop: number;
}

interface ScrollPositionProps {
    history: History;
}

// IMPLEMENTATIONS

function withScrollPosition(
    WrappedComponent: React.FC<WrappedComponentProps>,
    scrollPositionKey: string,
) {
    function ScrollPosition({ history }: ScrollPositionProps) {
        const props = {
            location: useLocation(),
            match: useMatch(window.location.pathname),
            history,
        };

        const initialScrollTop = history.action === 'POP' ? scrollPositions[scrollPositionKey] : 0;

        return <WrappedComponent {...props} initialScrollTop={initialScrollTop} />;
    }

    return ScrollPosition;
}

export default withScrollPosition;
