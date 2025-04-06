const inputs = {
	'download_folder': document.querySelector('#download-folder-input'),
	'concurrent_direct_downloads': document.querySelector('#concurrent-direct-downloads-input'),
	'failing_torrent_timeout': document.querySelector('#torrent-timeout-input'),
	'seeding_handling': document.querySelector('#seeding-handling-input'),
	'delete_completed_torrents': document.querySelector('#delete-torrents-input'),
};

function fillSettings(api_key) {
	fetchAPI('/settings', api_key)
	.then(json => {
		for (let key in inputs) {
			if (typeof json.result[key].value == 'boolean') {
				inputs[key].checked = json.result[key].value;
			}
			else if (key === 'failing_torrent_timeout') {
				inputs[key].value = ((json.result[key].value || 0) / 60) || '';
			}
			else {
				inputs[key].value = json.result[key].value;
			}
			inputs[key].disabled = json.result[key].locked;
		}
		fillPref(json.result.service_preference.value);
	});
};

function saveSettings(api_key) {
	document.querySelector("#save-button p").innerText = 'Saving';
	inputs.download_folder.classList.remove('error-input');
	const data = {
		'download_folder': inputs.download_folder.value,
		'concurrent_direct_downloads': parseInt(inputs.concurrent_direct_downloads.value),
		'failing_torrent_timeout': parseInt(inputs.failing_torrent_timeout.value || 0) * 60,
		'seeding_handling': inputs.seeding_handling.value,
		'delete_completed_torrents': inputs.delete_completed_torrents.checked,
		'service_preference': [...document.querySelectorAll('#pref-table select')].map(e => e.value)
	};
	sendAPI('PUT', '/settings', api_key, {}, data)
	.then(response => 
		document.querySelector("#save-button p").innerText = 'Saved'
	)
	.catch(e => {
		document.querySelector("#save-button p").innerText = 'Failed';
        e.json().then(e => {
            if (
                e.error === "InvalidSettingValue"
                && e.result.key === "download_folder"
                ||
                e.error === "FolderNotFound"
            )
                inputs.download_folder.classList.add('error-input');

			else
                console.log(e);
        });
	});
};

//
// Empty download folder
//
function emptyFolder(api_key) {
	sendAPI('DELETE', '/activity/folder', api_key)
	.then(response => {
		document.querySelector('#empty-download-folder').innerText = 'Done';
	});
};

//
// Service preference
//
function fillPref(pref) {
	const selects = document.querySelectorAll('#pref-table select');
	for (let i = 0; i < pref.length; i++) {
		const service = pref[i];
		const select = selects[i];
		select.onchange = updatePrefOrder;
		pref.forEach(option => {
			const entry = document.createElement('option');
			entry.value = option;
			entry.innerText = option.charAt(0).toUpperCase() + option.slice(1);
			if (option === service)
				entry.selected = true;
			select.appendChild(entry);
		});
	};
};

function updatePrefOrder(e) {
	const other_selects = document.querySelectorAll(
		`#pref-table select:not([data-place="${e.target.dataset.place}"])`
	);
	// Find select that has the value of the target select
	for (let i = 0; i < other_selects.length; i++) {
		if (other_selects[i].value === e.target.value) {
			// Set it to old value of target select
			all_values = [...document.querySelector('#pref-table select').options].map(e => e.value)
			used_values = new Set([...document.querySelectorAll('#pref-table select')].map(s => s.value));
			open_value = all_values.filter(e => !used_values.has(e))[0];
			other_selects[i].value = open_value;
			break;
		};
	};
};

// code run on load
usingApiKey()
.then(api_key => {
	fillSettings(api_key);

	document.querySelector('#save-button').onclick = e => saveSettings(api_key);
	document.querySelector('#empty-download-folder').onclick = e => emptyFolder(api_key);
});
