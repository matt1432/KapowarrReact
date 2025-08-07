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
import type { Store } from 'redux';

interface AppProps {
    store: Store;
}

// IMPLEMENTATIONS

function App({ store }: AppProps) {
    useTitle('Kapowarr');

    return (
        <Provider store={store}>
            <HistoryRouter>
                <ApplyTheme />
                <Page>
                    <AppRoutes />
                </Page>
            </HistoryRouter>
        </Provider>
    );
}

export default App;
