// IMPORTS

// React
import React from 'react';
import { useLocation, useMatch, useNavigationType } from 'react-router-dom';

// Redux
import scrollPositions from 'Store/scrollPositions';

// Types
interface WrappedComponentProps {
    initialScrollTop: number;
}

// IMPLEMENTATIONS

function withScrollPosition(
    WrappedComponent: React.FC<WrappedComponentProps>,
    scrollPositionKey: string,
) {
    function ScrollPosition() {
        const props = {
            location: useLocation(),
            match: useMatch(window.location.pathname),
        };

        const historyAction = useNavigationType();

        const initialScrollTop = historyAction === 'POP' ? scrollPositions[scrollPositionKey] : 0;

        return <WrappedComponent {...props} initialScrollTop={initialScrollTop} />;
    }

    return ScrollPosition;
}

export default withScrollPosition;
