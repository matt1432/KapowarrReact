import usingApiKey from './auth.js';
import { url_base, fetchAPI, sendAPI, getLocalStorage, setLocalStorage } from './general.js';

function fillSettings(api_key: string) {
    fetchAPI('/settings', api_key).then((json) => {
        (document.querySelector('#bind-address-input') as HTMLInputElement).value = json.result.host;
        (document.querySelector('#port-input') as HTMLInputElement).value = json.result.port;
        (document.querySelector('#url-base-input') as HTMLInputElement).value = json.result.url_base;
        (document.querySelector('#password-input') as HTMLInputElement).value = json.result.auth_password;
        (document.querySelector('#api-input') as HTMLInputElement).value = api_key;
        (document.querySelector('#cv-input') as HTMLInputElement).value = json.result.comicvine_api_key;
        (document.querySelector('#flaresolverr-input') as HTMLInputElement).value = json.result.flaresolverr_base_url;
        (document.querySelector('#log-level-input') as HTMLInputElement).value = json.result.log_level;
    });
    (document.querySelector('#theme-input') as HTMLInputElement).value = getLocalStorage('theme')['theme'];
};

function saveSettings(api_key: string) {
    (document.querySelector('#save-button p') as HTMLElement).innerText = 'Saving';
    (document.querySelector('#cv-input') as HTMLElement).classList.remove('error-input');
    (document.querySelector('#flaresolverr-input') as HTMLElement).classList.remove('error-input');

    const data = {
        host: (document.querySelector('#bind-address-input') as HTMLInputElement).value,
        port: parseInt((document.querySelector('#port-input') as HTMLInputElement).value),
        url_base: (document.querySelector('#url-base-input') as HTMLInputElement).value,
        auth_password: (document.querySelector('#password-input') as HTMLInputElement).value,
        comicvine_api_key: (document.querySelector('#cv-input') as HTMLInputElement).value,
        flaresolverr_base_url: (document.querySelector('#flaresolverr-input') as HTMLInputElement).value,
        log_level: parseInt((document.querySelector('#log-level-input') as HTMLInputElement).value),
    };

    sendAPI('PUT', '/settings', api_key, {}, data)
        .then((response) => response?.json())
        .then((json) => {
            if (json.error !== null) {
                return Promise.reject(json);
            }
            (document.querySelector('#save-button p') as HTMLElement).innerText = 'Saved';
        })
        .catch((e) => {
            (document.querySelector('#save-button p') as HTMLElement).innerText = 'Failed';
            if (e.error === 'InvalidComicVineApiKey') {
                (document.querySelector('#cv-input') as HTMLElement).classList.add('error-input');
            }

            else if (
                e.error === 'InvalidSettingValue' &&
                e.result.key === 'flaresolverr_base_url'
            ) {
                (document.querySelector('#flaresolverr-input') as HTMLElement).classList.add('error-input');
            }

            else {
                console.log(e.error);
            }
        });
};

function generateApiKey(api_key: string) {
    sendAPI('POST', '/settings/api_key', api_key)
        .then((response) => response?.json())
        .then((json) => {
            setLocalStorage({ api_key: json.result.api_key });
            (document.querySelector('#api-input') as HTMLElement).innerText = json.result.api_key;
        });
};

// code run on load

usingApiKey().then((api_key) => {
    fillSettings(api_key);
    (document.querySelector('#save-button') as HTMLElement).onclick = () => saveSettings(api_key);
    (document.querySelector('#generate-api') as HTMLElement).onclick = () => generateApiKey(api_key);
    (document.querySelector('#download-logs-button') as HTMLAnchorElement).href =
        `${url_base}/api/system/logs?api_key=${api_key}`;
});

(document.querySelector('#theme-input') as HTMLElement).onchange = () => {
    const value = (document.querySelector('#theme-input') as HTMLInputElement).value;

    setLocalStorage({ theme: value });
    if (value === 'dark') {
        (document.querySelector(':root') as HTMLElement).classList.add('dark-mode');
    }
    else if (value === 'light') {
        (document.querySelector(':root') as HTMLElement).classList.remove('dark-mode');
    }
};

export { };
