// IMPORTS

// React
import React from 'react';
import { useNavigationType } from 'react-router-dom';

// Redux
import { useRootSelector } from 'Store/createAppStore';

// Types
import type { ScrollPositionKey } from 'Store/Slices/App';

interface WrappedComponentProps {
    initialScrollTop: number;
}

// IMPLEMENTATIONS

export default function withScrollPosition(
    WrappedComponent: React.FC<WrappedComponentProps>,
    scrollPositionKey: ScrollPositionKey,
) {
    function ScrollPosition() {
        const { scrollPositions } = useRootSelector((state) => state.app);

        const historyAction = useNavigationType();

        const initialScrollTop =
            historyAction === 'POP' ? scrollPositions[scrollPositionKey] : 0;

        return <WrappedComponent initialScrollTop={initialScrollTop} />;
    }

    return ScrollPosition;
}
