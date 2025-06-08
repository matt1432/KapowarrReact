import { RootFolder } from './add_volume.js';
import usingApiKey from './auth.js';
import { url_base, hide, fetchAPI, sendAPI, convertSize } from './general.js';

const inputs = {
    renaming_input: document.querySelector('#renaming-input') as HTMLInputElement,
    volume_folder_naming_input: document.querySelector(
        '#volume-folder-naming-input',
    ) as HTMLInputElement,
    file_naming_input: document.querySelector('#file-naming-input') as HTMLInputElement,
    file_naming_empty_input: document.querySelector('#file-naming-empty-input') as HTMLInputElement,
    file_naming_sv_input: document.querySelector('#file-naming-sv-input') as HTMLInputElement,
    file_naming_vai_input: document.querySelector('#file-naming-vai-input') as HTMLInputElement,
    long_sv_input: document.querySelector('#long-sv-input') as HTMLInputElement,
    issue_padding_input: document.querySelector('#issue-padding-input') as HTMLInputElement,
    volume_padding_input: document.querySelector('#volume-padding-input') as HTMLInputElement,
    create_empty_volume_folders_input: document.querySelector('#create-vf-input') as HTMLInputElement,
    delete_empty_folders_input: document.querySelector('#delete-empty-folders-input') as HTMLInputElement,
    convert_input: document.querySelector('#convert-input') as HTMLInputElement,
    extract_input: document.querySelector('#extract-input') as HTMLInputElement,
};

let convert_options = [] as string[];
let convert_preference = [] as string[];

//
// Settings
//
function fillSettings(api_key: string) {
    fetchAPI('/settings', api_key).then((json) => {
        inputs.renaming_input.checked = json.result.rename_downloaded_files;
        inputs.volume_folder_naming_input.value = json.result.volume_folder_naming;
        inputs.file_naming_input.value = json.result.file_naming;
        inputs.file_naming_empty_input.value = json.result.file_naming_empty;
        inputs.file_naming_sv_input.value = json.result.file_naming_special_version;
        inputs.file_naming_vai_input.value = json.result.file_naming_vai;
        inputs.long_sv_input.checked = json.result.long_special_version;
        inputs.issue_padding_input.value = json.result.issue_padding;
        inputs.volume_padding_input.value = json.result.volume_padding;
        inputs.create_empty_volume_folders_input.checked = json.result.create_empty_volume_folders;
        inputs.delete_empty_folders_input.checked = json.result.delete_empty_folders;
        inputs.convert_input.checked = json.result.convert;
        inputs.extract_input.checked = json.result.extract_issue_ranges;

        fillConvert(api_key, json.result.format_preference);
    });
};

function saveSettings(api_key: string) {
    (document.querySelector('#save-button p') as HTMLElement).innerText = 'Saving';
    inputs.volume_folder_naming_input.classList.remove('error-input');
    inputs.file_naming_input.classList.remove('error-input');
    inputs.file_naming_empty_input.classList.remove('error-input');
    inputs.file_naming_sv_input.classList.remove('error-input');
    inputs.file_naming_vai_input.classList.remove('error-input');
    const data = {
        rename_downloaded_files: (document.querySelector('#renaming-input') as HTMLInputElement).checked,
        volume_folder_naming: (document.querySelector(
            '#volume-folder-naming-input',
        ) as HTMLInputElement).value,
        file_naming: inputs.file_naming_input.value,
        file_naming_empty: inputs.file_naming_empty_input.value,
        file_naming_special_version: inputs.file_naming_sv_input.value,
        file_naming_vai: inputs.file_naming_vai_input.value,
        long_special_version: inputs.long_sv_input.checked,
        issue_padding: parseInt(inputs.issue_padding_input.value),
        volume_padding: parseInt(inputs.volume_padding_input.value),
        create_empty_volume_folders: inputs.create_empty_volume_folders_input.checked,
        delete_empty_folders: inputs.delete_empty_folders_input.checked,
        convert: inputs.convert_input.checked,
        extract_issue_ranges: inputs.extract_input.checked,
        format_preference: convert_preference,
    };

    sendAPI('PUT', '/settings', api_key, {}, data)
        .then(() => {
            (document.querySelector('#save-button p') as HTMLElement).innerText = 'Saved';
        })
        .catch((ev) => {
            (document.querySelector('#save-button p') as HTMLElement).innerText = 'Failed';
            // eslint-disable-next-line
            ev.json().then((e: any) => {
                if (e.error === 'InvalidSettingValue') {
                    if (e.result.key === 'volume_folder_naming') {
                        inputs.volume_folder_naming_input.classList.add('error-input');
                    }
                    else if (e.result.key === 'file_naming') {
                        inputs.file_naming_input.classList.add('error-input');
                    }
                    else if (e.result.key === 'file_naming_empty') {
                        inputs.file_naming_empty_input.classList.add('error-input');
                    }
                    else if (e.result.key === 'file_naming_special_version') {
                        inputs.file_naming_sv_input.classList.add('error-input');
                    }
                    else if (e.result.key === 'file_naming_vai') {
                        inputs.file_naming_vai_input.classList.add('error-input');
                    }
                }
                else {
                    console.log(e.error);
                }
            });
        });
};

//
// Convert
//
function fillConvert(api_key: string, convert_pref: string[]) {
    fetchAPI('/settings/availableformats', api_key)
        .then((json) => {
            convert_options = json.result;

            convert_preference = convert_pref;
            updateConvertList();
        });
};

function getConvertList() {
    return Array.from(document.querySelectorAll(
        '#convert-table tr[data-place] select',
    ) as NodeListOf<HTMLSelectElement>).map((el) => el.value);
};

function updateConvertList() {
    const table = document.querySelector('#convert-table tbody') as HTMLElement;

    table.querySelectorAll('tr[data-place]').forEach(
        (e) => {
            e.remove();
        },
    );
    const no_conversion = table.querySelector('tr:has(#add-convert-input)') as HTMLTableRowElement;

    let last_index = -1;

    convert_preference.forEach((format, index) => {
        last_index = index;
        const entry = document.createElement('tr');

        entry.dataset.place = (index + 1).toString();

        const place = document.createElement('th');

        place.innerText = (index + 1).toString();
        entry.appendChild(place);

        const select_container = document.createElement('td');
        const select = document.createElement('select');

        convert_preference.forEach((o) => {
            const option = document.createElement('option');

            option.value = o;
            option.innerText = o;
            option.selected = format === o;
            select.appendChild(option);
        });
        select.onchange = () => {
            const other_el = Array.from(
                table.querySelectorAll(
                    `tr[data-place]:not([data-place="${index + 1}"]) select`,
                ) as NodeListOf<HTMLSelectElement>,
            ).filter(
                (el) => el.value === select.value,
            )[0];

            const used_values = new Set(Array.from(
                table.querySelectorAll('tr[data-place] select') as NodeListOf<HTMLSelectElement>,
            ).map((el) => el.value));
            const missing_value = convert_preference
                .filter((f) => !used_values.has(f))[0];

            other_el.value = missing_value;

            convert_preference = getConvertList();
        };
        select_container.appendChild(select);
        entry.appendChild(select_container);

        const delete_container = document.createElement('td');
        const delete_button = document.createElement('button');

        delete_button.title = 'Delete format from list';
        delete_button.type = 'button';
        delete_button.onclick = () => {
            entry.remove();
            convert_preference = getConvertList();
            updateConvertList();
        };
        const delete_button_icon = document.createElement('img');

        delete_button_icon.src = `${url_base}/static/img/delete.svg`;
        delete_button_icon.alt = '';

        delete_button.appendChild(delete_button_icon);
        delete_container.appendChild(delete_button);
        entry.appendChild(delete_container);

        no_conversion.insertAdjacentElement('beforebegin', entry);
    });

    no_conversion.querySelector('th')!.innerText = (last_index + 2).toString();

    const add_select = no_conversion.querySelector('select');

    add_select!.innerHTML = '';
    const not_added_formats = [
        'No Conversion',
        ...convert_options
            .filter((el) => !convert_preference.includes(el))
            .sort(),
    ];

    not_added_formats.forEach((format) => {
        const option = document.createElement('option');

        option.value = format;
        option.innerText = format;
        add_select!.appendChild(option);
    });
};

//
// Root folders
//
const root_folders = {};

function fillRootFolder(api_key: string) {
    fetchAPI('/rootfolder', api_key).then((json) => {
        const table = document.querySelector('#root-folder-list') as HTMLElement;

        table.innerHTML = '';

        json.result.forEach((root_folder: RootFolder) => {
            root_folders[root_folder.id] = root_folder.folder;

            const entry = document.createElement('tr');

            entry.dataset.id = root_folder.id.toString();

            const path = document.createElement('td');

            const path_input = document.createElement('input');

            path_input.readOnly = true;
            path_input.type = 'text';
            path_input.value = root_folder.folder;
            path_input.onkeydown = (e) => {
                if (e.key !== 'Enter') {
                    return;
                }
                sendAPI('PUT', `/rootfolder/${root_folder.id}`, api_key, {}, {
                    folder: path_input.value,
                })
                    .then(() => fillRootFolder(api_key))
                    .catch((response) => {
                        if (response.status === 400) {
                            hide(
                                [],
                                [document.querySelector(
                                    `#root-folder-list tr[data-id="${root_folder.id}"] p`,
                                )!],
                            );
                        }
                        else {
                            console.log(response.status);
                        }
                    });
            };
            path.appendChild(path_input);

            const path_error = document.createElement('p');

            path_error.classList.add('error', 'hidden');
            path_error.innerText = '*Folder is in other root folder';
            path.appendChild(path_error);

            entry.appendChild(path);

            const free_space = document.createElement('td');

            free_space.classList.add('number-column');
            free_space.innerText = convertSize(root_folder.size.free);
            entry.appendChild(free_space);

            const total_space = document.createElement('td');

            total_space.classList.add('number-column');
            total_space.innerText = convertSize(root_folder.size.total);
            entry.appendChild(total_space);

            const root_folder_action_container = document.createElement('td');

            root_folder_action_container.classList.add('action-column');

            const edit_root_folder = document.createElement('button');

            edit_root_folder.onclick = () => toggleEditRootFolder(root_folder.id);
            edit_root_folder.type = 'button';
            const edit_root_folder_icon = document.createElement('img');

            edit_root_folder_icon.src = `${url_base}/static/img/edit.svg`;
            edit_root_folder.appendChild(edit_root_folder_icon);
            root_folder_action_container.appendChild(edit_root_folder);

            const delete_root_folder = document.createElement('button');

            delete_root_folder.onclick = () => deleteRootFolder(root_folder.id, api_key);
            delete_root_folder.type = 'button';
            const delete_root_folder_icon = document.createElement('img');

            delete_root_folder_icon.src = `${url_base}/static/img/delete.svg`;
            delete_root_folder.appendChild(delete_root_folder_icon);
            root_folder_action_container.appendChild(delete_root_folder);

            entry.appendChild(root_folder_action_container);

            table.appendChild(entry);
        });
    });
};

function toggleAddRootFolder() {
    hide([
        document.querySelector('#folder-error')!,
        document.querySelector('#folder-in-folder-error')!,
    ]);
    (document.querySelector('#folder-input') as HTMLInputElement).value = '';
    (document.querySelector('#add-row') as HTMLElement).classList.toggle('hidden');
};

function addRootFolder(api_key: string) {
    const folder_input = document.querySelector('#folder-input') as HTMLInputElement;
    const folder = folder_input.value;

    folder_input.value = '';

    sendAPI('POST', '/rootfolder', api_key, {}, { folder })
        .then(() => {
            fillRootFolder(api_key);
            toggleAddRootFolder();
        })
        .catch((e) => {
            if (e.status === 404) {
                hide(
                    [document.querySelector('#folder-in-folder-error')!],
                    [document.querySelector('#folder-error')!],
                );
            }
            else if (e.status === 400) {
                hide(
                    [document.querySelector('#folder-error')!],
                    [document.querySelector('#folder-in-folder-error')!],
                );
            }
        });
};

function toggleEditRootFolder(id: number) {
    hide(
        [document.querySelector(`#root-folder-list tr[data-id="${id}"] p`)!],
        [],
    );

    const input = document.querySelector(
        `#root-folder-list tr[data-id="${id}"] input`,
    ) as HTMLInputElement;

    if (input.readOnly) {
        input.readOnly = false;
    }
    else {
        input.value = root_folders[id];
        input.readOnly = true;
    };
};

function deleteRootFolder(id: number, api_key: string) {
    sendAPI('DELETE', `/rootfolder/${id}`, api_key)
        .then(() => {
            (document.querySelector(`tr[data-id="${id}"]`) as HTMLElement).remove();
        })
        .catch((e) => {
            if (e.status === 400) {
                const message = document.createElement('p');

                message.classList.add('error');
                message.innerText = 'Root folder is still in use by a volume';
                (document.querySelector(
                    `tr[data-id="${id}"] > :nth-child(1)`,
                ) as HTMLElement).appendChild(message);
            };
        });
};

// code run on load

usingApiKey().then((api_key) => {
    fillSettings(api_key);
    fillRootFolder(api_key);

    (document.querySelector('#save-button') as HTMLElement).onclick = () => saveSettings(api_key);
    (document.querySelector('#add-folder') as HTMLElement).onclick = () => addRootFolder(api_key);
    (document.querySelector('#folder-input') as HTMLElement).onkeydown = (e) => e.code === 'Enter' ?
        addRootFolder(api_key) :
        null;
});

(document.querySelector('#toggle-root-folder') as HTMLElement).onclick = () => toggleAddRootFolder();
(document.querySelector('#add-convert-input') as HTMLElement).onchange = (e) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;

    if (value !== 'No Conversion') {
        convert_preference.push(value);
        updateConvertList();
    };
};

export { };
