import 'Styles/globals.css';
import './index.css';

window.Kapowarr = {
    apiKey: '',
    apiRoot: '/api',
    urlBase: (document.querySelector('#url_base') as HTMLMetaElement).dataset
        .value!,
    version: (document.querySelector('#version') as HTMLMetaElement).dataset
        .value!,
};

(async () => {
    await import(`${window.Kapowarr.urlBase}/static/js/bootstrap.js`);
})();
