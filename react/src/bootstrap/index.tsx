import { createRoot } from 'react-dom/client';

import { history, store } from 'Store/createAppStore';

import App from 'App/App';

const container = document.getElementById('root');

createRoot(container!).render(<App store={store} history={history} />);
