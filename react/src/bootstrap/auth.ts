export default async function getApiKey(redirect = true) {
    const key_data = JSON.parse(localStorage.getItem('kapowarr') ?? '');

    if (key_data.api_key === null || key_data.last_login < Date.now() / 1000 - 86400) {
        return fetch(`${window.Kapowarr.apiRoot}/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{}',
        })
            .then((response) => {
                if (!response.ok) {
                    return Promise.reject(response.status);
                }

                return response.json();
            })
            .then((json) => {
                key_data.api_key = json.result.api_key;
                key_data.last_login = Date.now() / 1000;
                localStorage.setItem('kapowarr', JSON.stringify(key_data));

                return json.result.api_key;
            })
            .catch((e) => {
                if (e === 401) {
                    if (redirect) {
                        window.location.href = `${window.Kapowarr.urlBase}/login?redirect=${window.location.pathname}`;
                    }
                    else {
                        return null;
                    }
                }
                else {
                    console.log(e);

                    return null;
                }
            });
    }
    else {
        return key_data.api_key;
    }
}
