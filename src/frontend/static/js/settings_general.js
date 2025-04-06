const inputs = {
	'host': document.querySelector('#bind-address-input'),
	'port': document.querySelector('#port-input'),
	'url_base': document.querySelector('#url-base-input'),
	'auth_password': document.querySelector('#password-input'),
	'comicvine_api_key': document.querySelector('#cv-input'),
	'flaresolverr_base_url': document.querySelector('#flaresolverr-input'),
	'log_level': document.querySelector('#log-level-input'),
};

function fillSettings(api_key) {
	fetchAPI('/settings', api_key)
	.then(json => {
		for (let key in inputs) {
			if (typeof json.result[key].value == 'boolean') {
				inputs[key].checked = json.result[key].value;
			}
			else {
				inputs[key].value = json.result[key].value;
			}
			inputs[key].disabled = json.result[key].locked;
		}
		document.querySelector('#api-input').value = api_key;
	});
	document.querySelector('#theme-input').value = getLocalStorage('theme')['theme'];
};

function saveSettings(api_key) {
	document.querySelector("#save-button p").innerText = 'Saving';
	inputs.comicvine_api_key.classList.remove('error-input');
	inputs.flaresolverr_base_url.classList.remove('error-input');
	const data = {
		'host': inputs.host.value,
		'port': parseInt(inputs.port.value),
		'url_base': inputs.url_base.value,
		'auth_password': inputs.auth_password.value,
		'comicvine_api_key': inputs.comicvine_api_key.value,
		'flaresolverr_base_url': inputs.flaresolverr_base_url.value,
		'log_level': parseInt(inputs.log_level.value)
	};
	sendAPI('PUT', '/settings', api_key, {}, data)
	.then(response => response.json())
	.then(json => {
		if (json.error !== null) return Promise.reject(json);
		document.querySelector("#save-button p").innerText = 'Saved';
	})
	.catch(e => {
		document.querySelector("#save-button p").innerText = 'Failed';
		if (e.error === 'InvalidComicVineApiKey')
			inputs.comicvine_api_key.classList.add('error-input');

		else if (
			e.error === "InvalidSettingValue"
			&& e.result.key === "flaresolverr_base_url"
		)
			inputs.flaresolverr_base_url.classList.add('error-input');

		else
			console.log(e.error);
	});
};

function generateApiKey(api_key) {
	sendAPI('POST', '/settings/api_key', api_key)
	.then(response => response.json())
	.then(json => {
		const api_key = json.result.api_key.value;
		setLocalStorage({'api_key': api_key});
		document.querySelector('#api-input').innerText = api_key;
	});
};

// code run on load

usingApiKey()
.then(api_key => {
	fillSettings(api_key);
	document.querySelector('#save-button').onclick = e => saveSettings(api_key);
	document.querySelector('#generate-api').onclick = e => generateApiKey(api_key);
	document.querySelector('#download-logs-button').href =
		`${url_base}/api/system/logs?api_key=${api_key}`;
});

document.querySelector('#theme-input').onchange = e => {
	const value = document.querySelector('#theme-input').value;
	setLocalStorage({'theme': value});
	if (value === 'dark')
		document.querySelector(':root').classList.add('dark-mode');
	else if (value === 'light')
		document.querySelector(':root').classList.remove('dark-mode');
};
