import usingApiKey from './auth.js';
import { fetchAPI, sendAPI } from './general.js';

/* Types */
export interface Settings {
    database_version: number
    log_level: number
    auth_password: string
    comicvine_api_key: string
    api_key: string
    host: string
    port: number
    url_base: string
    backup_host: string
    backup_port: number
    backup_url_base: string
    rename_downloaded_files: boolean
    volume_folder_naming: string
    file_naming: string
    file_naming_empty: string
    file_naming_special_version: string
    file_naming_vai: string
    long_special_version: boolean
    volume_padding: number
    issue_padding: number
    service_preference: string[]
    download_folder: string
    concurrent_direct_downloads: number
    failing_download_timeout: number
    seeding_handling: string
    delete_completed_torrents: boolean
    convert: boolean
    extract_issue_ranges: boolean
    format_preference: string[]
    flaresolverr_base_url: string
    enable_getcomics: boolean
    enable_libgen: boolean
}

function fillSettings(api_key: string) {
    fetchAPI('/settings', api_key).then((json) => {
        const result: Settings = json.result;

        (document.querySelector('#download-folder-input') as HTMLInputElement).value = result
            .download_folder;

        (document.querySelector('#concurrent-direct-downloads-input') as HTMLInputElement).value = result
            .concurrent_direct_downloads.toString();

        (document.querySelector('#download-timeout-input') as HTMLInputElement).value = (
            ((result.failing_download_timeout || 0) / 60).toString()
        ) || '';

        (document.querySelector('#seeding-handling-input') as HTMLInputElement).value = result
            .seeding_handling;

        (document.querySelector('#delete-torrents-input') as HTMLInputElement).checked = result
            .delete_completed_torrents;

        fillPref(result.service_preference);
    });
};

function saveSettings(api_key: string) {
    (document.querySelector('#save-button p') as HTMLElement).innerText = 'Saving';
    document.querySelector('#download-folder-input')?.classList.remove('error-input');
    const data = {
        download_folder: (document.querySelector('#download-folder-input') as HTMLInputElement).value,
        concurrent_direct_downloads: parseInt(
            (document.querySelector('#concurrent-direct-downloads-input') as HTMLInputElement).value,
        ),
        failing_download_timeout: parseInt(
            (document.querySelector('#download-timeout-input') as HTMLInputElement).value || '0',
        ) * 60,
        seeding_handling: (document.querySelector('#seeding-handling-input') as HTMLInputElement).value,
        delete_completed_torrents: (document.querySelector(
            '#delete-torrents-input',
        ) as HTMLInputElement).checked,
        service_preference: Array.from((document.querySelectorAll(
            '#pref-table select',
        ) as NodeListOf<HTMLInputElement>)).map((e) => e.value),
    };

    sendAPI('PUT', '/settings', api_key, {}, data)
        .then(() => {
            (document.querySelector('#save-button p') as HTMLElement).innerText = 'Saved';
        })
        .catch((e) => {
            (document.querySelector('#save-button p') as HTMLElement).innerText = 'Failed';

            // eslint-disable-next-line
            e.json().then((e: any) => {
                if (
                    (e.error === 'InvalidSettingValue' && e.result.key === 'download_folder') ||
                    e.error === 'FolderNotFound'
                ) {
                    document.querySelector('#download-folder-input')?.classList.add('error-input');
                }

                else {
                    console.log(e);
                }
            });
        });
};

//
// Empty download folder
//
function emptyFolder(api_key: string) {
    sendAPI('DELETE', '/activity/folder', api_key).then(() => {
        (document.querySelector('#empty-download-folder') as HTMLButtonElement).innerText = 'Done';
    });
};

//
// Service preference
//
function fillPref(pref: string[]) {
    const selects = document.querySelectorAll('#pref-table select') as NodeListOf<HTMLSelectElement>;

    for (let i = 0; i < pref.length; i++) {
        const service = pref[i];
        const select = selects[i];

        select.onchange = updatePrefOrder;

        pref.forEach((option) => {
            const entry = document.createElement('option');

            entry.value = option;
            entry.innerText = option.charAt(0).toUpperCase() + option.slice(1);
            if (option === service) {
                entry.selected = true;
            }
            select.appendChild(entry);
        });
    };
};

function updatePrefOrder(e: Event) {
    const target = e.target as HTMLInputElement;
    const other_selects = Array.from(document.querySelectorAll(
        `#pref-table select:not([data-place="${target.dataset.place}"])`,
    )) as HTMLSelectElement[];

    // Find select that has the value of the target select
    for (const select of other_selects) {
        if (select.value === target.value) {
            // Set it to old value of target select
            const all_values = Array.from((document.querySelector(
                '#pref-table select',
            ) as HTMLSelectElement).options).map((s) => s.value);
            const used_values = new Set([
                ...(Array.from(document.querySelectorAll('#pref-table select')) as HTMLSelectElement[]),
            ].map((s) => s.value));

            select.value = all_values.filter((v) => !used_values.has(v))[0];
            break;
        };
    };
};

// code run on load
usingApiKey().then((api_key) => {
    fillSettings(api_key);

    (document.querySelector('#save-button') as HTMLButtonElement).onclick = () => saveSettings(api_key);
    (document.querySelector(
        '#empty-download-folder',
    ) as HTMLButtonElement).onclick = () => emptyFolder(api_key);
});
