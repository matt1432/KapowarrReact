import usingApiKey from './auth.js';

const url_base = (document.querySelector('#url_base') as HTMLInputElement).dataset.value;

function redirect() {
    const parameters = new URLSearchParams(window.location.search);

    window.location.href = parameters.get('redirect') || `${url_base}/`;
}

function registerLogin(api_key: string) {
    const data = JSON.parse(localStorage.getItem('kapowarr') ?? '');

    data.api_key = api_key;
    data.last_login = Date.now();
    localStorage.setItem('kapowarr', JSON.stringify(data));
    redirect();
}

function login() {
    const error = document.querySelector('#error-message') as HTMLElement;

    error.classList.add('hidden');

    const password_input = document.querySelector('#password-input') as HTMLInputElement;
    const data = {
        password: password_input.value,
    };

    fetch(`${url_base}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (!response.ok) {
                return Promise.reject(response.status);
            }

            return response.json();
        })
        .then((json) => registerLogin(json.result.api_key))
        .catch((e) => {
            // Login failed
            if (e === 401) {
                error.classList.remove('hidden');
            }
            else {
                console.log(e);
            };
        });
}

// code run on load
usingApiKey(false).then((api_key) => {
    if (api_key) {
        redirect();
    }
});

if (JSON.parse(localStorage.getItem('kapowarr') || '{ "theme": "light" }')['theme'] === 'dark') {
    document.querySelector(':root')?.classList.add('dark-mode');
}

(document.querySelector('#login-form') as HTMLFormElement).action = 'javascript:login();';

declare global {
    interface Window {
        login: () => void
    }
}

window.login = login;
