import getApiKey from 'bootstrap/auth';
import setupLocalStorage from 'Utilities/LocalStorage/setupLocalStorage';

import 'Styles/globals.css';
import './index.css';

setupLocalStorage();
window.Kapowarr = {
    apiKey: '',
    apiRoot: '/api',
    instanceName: '',
    urlBase: (document.querySelector('#url_base') as HTMLButtonElement).dataset.value!,
    version: '',
};

(async () => {
    const { urlBase, apiRoot } = window.Kapowarr;
    const key = await getApiKey(urlBase, apiRoot);

    // TODO: handle when apiKey is undefined
    window.Kapowarr.apiKey = key ?? '';

    await import(`${window.Kapowarr.urlBase}/static/js/bootstrap.js`);
})();
