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

// Types
import type { History } from 'history';
import type { Store } from 'redux';

interface AppProps {
    store: Store;
    history: History;
}

// IMPLEMENTATIONS

function App({ store, history }: AppProps) {
    useTitle(window.Kapowarr.instanceName);

    return (
        <Provider store={store}>
            <HistoryRouter history={history} basename={window.Kapowarr.urlBase}>
                <ApplyTheme />
                <Page>
                    <AppRoutes history={history} />
                </Page>
            </HistoryRouter>
        </Provider>
    );
}

export default App;
