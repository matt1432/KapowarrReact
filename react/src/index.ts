import getApiKey from 'bootstrap/auth';

import 'Styles/globals.css';
import './index.css';

// Init empty values
window.Kapowarr = {
    apiKey: '',
    apiRoot: '',
    instanceName: '',
    theme: '',
    urlBase: '',
    version: '',
};

window.Kapowarr.urlBase = (document.querySelector('#url_base') as HTMLButtonElement).dataset.value!;
window.Kapowarr.apiRoot = `${window.Kapowarr.urlBase}/api`;

(async () => {
    window.Kapowarr.apiKey = await getApiKey();

    await import(`${window.Kapowarr.urlBase}/static/js/bootstrap.js`);
})();
