import { createRoot } from 'react-dom/client';
import createAppStore from 'Store/createAppStore';
import App from './App/App';

const { store, history } = createAppStore();
const container = document.getElementById('root');

createRoot(container!).render(<App store={store} history={history} />);
