import { Provider } from 'react-redux';
import { type Store } from 'redux';
import Page from 'Components/Page/Page';
import ApplyTheme from './ApplyTheme';
import type { History } from 'history';
import AppRoutes from './AppRoutes';
import { HistoryRouter } from './HistoryRouter';
import { useTitle } from 'Helpers/Hooks/useTitle';

interface AppProps {
    store: Store;
    history: History;
}

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
