import getApiKey from 'bootstrap/auth';
import setupLocalStorage from 'Utilities/LocalStorage/setupLocalStorage';

import 'Styles/globals.css';
import './index.css';

setupLocalStorage();
window.Kapowarr = {
    apiKey: '',
    apiRoot: '/api',
    urlBase: (document.querySelector('#url_base') as HTMLMetaElement).dataset.value!,
    version: (document.querySelector('#version') as HTMLMetaElement).dataset.value!,
};

(async () => {
    const { urlBase, apiRoot } = window.Kapowarr;
    const key = await getApiKey(urlBase, apiRoot);

    // TODO: handle when apiKey is undefined
    window.Kapowarr.apiKey = key ?? '';

    await import(`${window.Kapowarr.urlBase}/static/js/bootstrap.js`);
})();
