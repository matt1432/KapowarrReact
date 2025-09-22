// IMPORTS

// React
import { createRoot } from 'react-dom/client';

// Redux
import { store } from 'Store/createAppStore';

// General Components
import App from 'App/App';

// IMPLEMENTATIONS

const container = document.getElementById('root');

createRoot(container!).render(<App store={store} />);
