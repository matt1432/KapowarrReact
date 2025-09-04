// IMPORTS

// Redux
import { Provider } from 'react-redux';

// Misc
import { useTitle } from 'Helpers/Hooks/useTitle';

// General Components
import Page from 'Components/Page/Page';

// Specific Components
import { HistoryRouter } from './HistoryRouter';

import ApplyTheme from './ApplyTheme';
import AppRoutes from './AppRoutes';
import SocketListener from './SocketListener';

// Types
import type { Store } from 'redux';

interface AppProps {
    store: Store;
}

// IMPLEMENTATIONS

export default function App({ store }: AppProps) {
    useTitle('Kapowarr');

    return (
        <Provider store={store}>
            <HistoryRouter>
                <ApplyTheme />
                <SocketListener />
                <Page>
                    <AppRoutes />
                </Page>
            </HistoryRouter>
        </Provider>
    );
}
