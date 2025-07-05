import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DocumentTitle from 'react-document-title';
import { Provider } from 'react-redux';
import { type Store } from 'redux';
import Page from 'Components/Page/Page';
import ApplyTheme from './ApplyTheme';
import type { History } from 'history';
import AppRoutes from './AppRoutes';
import { HistoryRouter } from './HistoryRouter';

interface AppProps {
    store: Store;
    history: History;
}

const queryClient = new QueryClient();

function App({ store, history }: AppProps) {
    return (
        <DocumentTitle title={window.Kapowarr.instanceName}>
            <QueryClientProvider client={queryClient}>
                <Provider store={store}>
                    <HistoryRouter history={history} basename={window.Kapowarr.urlBase}>
                        <ApplyTheme />
                        <Page>
                            <AppRoutes history={history} />
                        </Page>
                    </HistoryRouter>
                </Provider>
            </QueryClientProvider>
        </DocumentTitle>
    );
}

export default App;
