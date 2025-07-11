import getLocalStorage from 'Utilities/LocalStorage/getLocalStorage';

export default async function getApiKey(): Promise<string | undefined> {
    const localKapowarr = getLocalStorage();

    if (!localKapowarr.apiKey || (localKapowarr.lastLogin ?? 0) < Date.now() / 1000 - 86400) {
        await fetch(`${window.Kapowarr.urlBase}${window.Kapowarr.apiRoot}/auth`, {
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
                localKapowarr.apiKey = json.result.api_key;
                localKapowarr.lastLogin = Date.now() / 1000;
                localStorage.setItem('kapowarr', JSON.stringify(localKapowarr));

                return json.result.api_key;
            })
            .catch((e) => {
                console.log(e);
            });
    }
    else {
        return localKapowarr.apiKey;
    }
}
