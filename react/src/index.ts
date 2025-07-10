import getApiKey from 'bootstrap/auth';
import setupLocalStorage from 'Utilities/LocalStorage/setupLocalStorage';
import getLocalStorage from 'Utilities/LocalStorage/getLocalStorage';

import 'Styles/globals.css';
import './index.css';

// Init default values
window.Kapowarr = {
    apiKey: '',
    apiRoot: '',
    instanceName: '',
    theme: 'light',
    urlBase: '/',
    version: '',
};

window.Kapowarr.urlBase = (document.querySelector('#url_base') as HTMLButtonElement).dataset.value!;
window.Kapowarr.apiRoot = '/api';

(async () => {
    // TODO: handle when apiKey is undefined
    window.Kapowarr.apiKey = (await getApiKey()) ?? '';

    setupLocalStorage();

    const localKapowarr = getLocalStorage();

    window.Kapowarr.theme = localKapowarr.theme;

    await import(`${window.Kapowarr.urlBase}/static/js/bootstrap.js`);
})();
