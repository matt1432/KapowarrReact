import React from 'react';
import { useLocation, useMatch } from 'react-router-dom';
import scrollPositions from 'Store/scrollPositions';
import { type History } from 'history';

interface WrappedComponentProps {
    initialScrollTop: number;
}

interface ScrollPositionProps {
    history: History;
}

function withScrollPosition(
    WrappedComponent: React.FC<WrappedComponentProps>,
    scrollPositionKey: string,
) {
    function ScrollPosition(props: ScrollPositionProps) {
        const _props = {
            location: useLocation(),
            match: useMatch(window.location.pathname),
            ...props,
        };

        const initialScrollTop =
            props.history.action === 'POP' ? scrollPositions[scrollPositionKey] : 0;

        return <WrappedComponent {..._props} initialScrollTop={initialScrollTop} />;
    }

    return ScrollPosition;
}

export default withScrollPosition;
