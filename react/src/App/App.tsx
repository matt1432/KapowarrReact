// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import { Provider } from 'react-redux';
import { type Store } from 'redux';
import Page from 'Components/Page/Page';
import ApplyTheme from './ApplyTheme';
import type { History } from 'history';
import AppRoutes from './AppRoutes';

interface AppProps {
    store: Store;
    history: History;
}

// const queryClient = new QueryClient();

function App({ store, history }: AppProps) {
    return (
        <DocumentTitle title={window.Kapowarr.instanceName}>
            {/*<QueryClientProvider client={queryClient}>*/}
            <Provider store={store}>
                <Router history={history}>
                    <ApplyTheme />
                    <Page>
                        <AppRoutes />
                    </Page>
                </Router>
            </Provider>
            {/*</QueryClientProvider>*/}
        </DocumentTitle>
    );
}

export default App;
