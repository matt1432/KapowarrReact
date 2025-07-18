// IMPORTS

// React
import { type ReactNode, useLayoutEffect, useState } from 'react';
import { Router } from 'react-router-dom';

// Types
import type { History } from 'history';

export type Props = {
    basename?: string;
    history: History;
    children?: ReactNode;
};

// IMPLEMENTATIONS

export const HistoryRouter = (props: Props) => {
    const { basename, children, history } = props;
    const [historyState, setHistoryState] = useState({
        action: history.action,
        location: history.location,
    });

    useLayoutEffect(() => history.listen(setHistoryState), [history]);

    return (
        <Router
            basename={basename}
            location={historyState.location}
            navigationType={historyState.action}
            navigator={history}
        >
            {children}
        </Router>
    );
};
