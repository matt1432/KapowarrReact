import 'Styles/globals.css';
import './index.css';

// const initializeUrl = `${window.Kapowarr.urlBase}/initialize.json?t=${Date.now()}`;
// const response = await fetch(initializeUrl);

// window.Kapowarr = await response.json();

window.Kapowarr = {
    apiKey: '',
    apiRoot: '',
    instanceName: '',
    isProduction: true,
    theme: 'dark',
    urlBase: '/kapowarr',
    version: '2.0.0',
};

(async () => {
    await import(`${window.Kapowarr.urlBase}/static/js/bootstrap.js`);
})();
