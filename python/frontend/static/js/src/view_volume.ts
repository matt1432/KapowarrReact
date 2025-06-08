import usingApiKey from './auth.js';

import WindowFuncs from './window.js';
import {
    url_base,
    volume_id,
    setIcon,
    setImage,
    hide,
    fetchAPI,
    sendAPI,
    icons,
    images,
    task_to_button,
    mapButtons,
    convertSize,
} from './general.js';

/* Types */
import { RootFolder } from './add_volume.js';

export interface FileData {
    id: number
    filepath: string
    size: number
    releaser: string
    scan_type: string
    resolution: string
    dpi: string
}

export interface GeneralFileData extends FileData {
    file_type: string
}

export interface IssueData {
    id: number
    volume_id: number
    comicvine_id: number
    issue_number: string
    calculated_issue_number: number
    title: string | null
    date: string | null
    description: string | null
    monitored: boolean
    files: FileData[]
}

export interface VolumePublicInfo {
    id: number
    comicvine_id: number
    libgen_url: string | null
    title: string
    alt_title: string | null
    year: number
    publisher: string
    volume_number: number
    description: string
    site_url: string
    monitored: boolean
    monitor_new_issues: boolean
    root_folder: string
    folder: string
    custom_folder: boolean
    special_version: string
    special_version_locked: boolean
    last_cv_fetch: number
    issue_count: number
    issues_downloaded: number
    total_size: number
    volume_folder: string
    issues: IssueData[]
    general_files: GeneralFileData[]
}

export interface FilenameData {
    series: string
    year: number | null
    volume_number: number | [number, number] | null
    special_version: string | null
    issue_number: number | null
    annual: boolean
}

export interface SearchResultData extends FilenameData {
    link: string
    display_title: string
    source: string
    filesize: number
    pages: number
    releaser: string | null
    scan_type: string | null
    resolution: string | null
    dpi: string | null
    extension: string | null
    comics_id: number | null
    md5: string | null
}

export interface SearchResultMatchData {
    match: boolean
    match_issue: string | null
}

export interface MatchedSearchResultData extends SearchResultMatchData, SearchResultData {
    _issue_number: number | [number, number]
}

export type PreviewRenameResult = Record<string, string>;

const ViewEls = {
    views: {
        loading: document.querySelector('#loading-screen') as HTMLDivElement,
        main: document.querySelector('main')!,
    },
    pre_build: {
        issue_entry: document.querySelector('.pre-build-els .issue-entry') as HTMLTableRowElement,
        manual_search: document.querySelector('.pre-build-els .search-entry') as HTMLTableRowElement,
        rename_before: document.querySelector('.pre-build-els .rename-before') as HTMLTableRowElement,
        rename_after: document.querySelector('.pre-build-els .rename-after') as HTMLTableRowElement,
        files_entry: document.querySelector('.pre-build-els .files-entry') as HTMLTableRowElement,
        general_files_entry: document.querySelector(
            '.pre-build-els .general-files-entry',
        ) as HTMLTableRowElement,
    },
    vol_data: {
        monitor: document.querySelector('#volume-monitor') as HTMLButtonElement,
        title: document.querySelector('.volume-title-monitored > h2') as HTMLElement,
        cover: document.querySelector('.volume-info > img') as HTMLImageElement,
        tags: document.querySelector('#volume-tags') as HTMLTableSectionElement,
        path: document.querySelector('#volume-path') as HTMLParagraphElement,
        description: document.querySelector('#volume-description') as HTMLTableSectionElement,
        mobile_description: document.querySelector(
            '#volume-description-mobile',
        ) as HTMLTableSectionElement,
    },
    vol_edit: {
        monitor: document.querySelector('#monitored-input') as HTMLSelectElement,
        monitor_new_issues: document.querySelector('#monitor-issues-input') as HTMLSelectElement,
        monitoring_scheme: document.querySelector('#monitoring-scheme-input') as HTMLSelectElement,
        root_folder: document.querySelector('#root-folder-input') as HTMLSelectElement,
        volume_folder: document.querySelector('#volumefolder-input') as HTMLInputElement,
        special_version: document.querySelector('#specialoverride-input') as HTMLSelectElement,
        libgen_edit: document.querySelector('#libgen-edit-input') as HTMLInputElement,
    },
    tool_bar: {
        refresh: document.querySelector('#refresh-button') as HTMLButtonElement,
        auto_search: document.querySelector('#autosearch-button') as HTMLButtonElement,
        manual_search: document.querySelector('#manualsearch-button') as HTMLButtonElement,
        rename: document.querySelector('#rename-button') as HTMLButtonElement,
        convert: document.querySelector('#convert-button') as HTMLButtonElement,
        files: document.querySelector('#files-button') as HTMLButtonElement,
        edit: document.querySelector('#edit-button') as HTMLButtonElement,
        delete: document.querySelector('#delete-button') as HTMLButtonElement,
    },
    issues_list: document.querySelector('#issues-list') as HTMLElement,
};

//
// Filling data
//
class IssueEntry {
    id: string;
    api_key: string;
    entry: HTMLTableRowElement;
    monitored: HTMLButtonElement;
    issue_number: HTMLElement;
    title: HTMLElement;
    date: HTMLElement;
    status: HTMLElement;
    auto_search: HTMLButtonElement;
    manual_search: HTMLButtonElement;
    convert: HTMLButtonElement;


    constructor(id: string, api_key: string) {
        this.id = id;
        this.api_key = api_key;
        this.entry = ViewEls.issues_list.querySelector(`tr[data-id="${id}"]`)!;

        this.monitored = this.entry.querySelector('.issue-monitored button')!;
        this.issue_number = this.entry.querySelector('.issue-number')!;
        this.title = this.entry.querySelector('.issue-title')!;
        this.date = this.entry.querySelector('.issue-date')!;
        this.status = this.entry.querySelector('.issue-status')!;
        this.auto_search = this.entry.querySelector('.action-column :nth-child(1)')!;
        this.manual_search = this.entry.querySelector('.action-column :nth-child(2)')!;
        this.convert = this.entry.querySelector('.action-column :nth-child(3)')!;
    };

    setMonitorIcon() {
        if (this.monitored.dataset.monitored === 'true') {
            setIcon(
                this.monitored,
                icons.monitored,
                'Issue is monitored. Click to unmonitor.',
            );
        }
        else {
            setIcon(
                this.monitored,
                icons.unmonitored,
                'Issue is umonitored. Click to monitor.',
            );
        };
    };

    toggleMonitored() {
        const monitored = this.monitored.dataset.monitored !== 'true';

        sendAPI('PUT', `/issues/${this.id}`, this.api_key, {}, {
            monitored,
        })
            .then(() => {
                this.monitored.dataset.monitored = JSON.stringify(monitored);
                this.setMonitorIcon();
            });
    };

    setDownloaded(downloaded: number) {
        if (downloaded) {
            // Downloaded
            setImage(this.status, images.check, 'Issue is downloaded');
            this.status.classList.remove('error');
            this.status.classList.add('success');
        }
        else {
            // Not downloaded
            setImage(this.status, images.cancel, 'Issue is not downloaded');
            this.status.classList.remove('success');
            this.status.classList.add('error');
        };
    };
};

function fillTable(issues: IssueData[], api_key: string) {
    ViewEls.issues_list.innerHTML = '';

    for (let i = issues.length - 1; i >= 0; i--) {
        const obj = issues[i];

        const entry = ViewEls.pre_build.issue_entry
            .cloneNode(true) as typeof ViewEls.pre_build.issue_entry;

        entry.dataset.id = obj.id.toString();
        ViewEls.issues_list.appendChild(entry);

        const inst = new IssueEntry(obj.id.toString(), api_key);

        // ARIA
        inst.entry.ariaLabel = `Issue ${obj.issue_number}`;

        // Monitored
        inst.monitored.dataset.monitored = JSON.stringify(obj.monitored);
        inst.monitored.dataset.id = obj.id.toString();
        inst.monitored.onclick = () => inst.toggleMonitored();
        inst.setMonitorIcon();

        // Issue number
        inst.issue_number.innerText = obj.issue_number;

        // Title
        inst.title.innerText = obj.title ?? '';
        inst.title.onclick = () => showIssueInfo(obj.id, api_key);

        // Release date
        inst.date.innerText = obj.date ?? '';

        // Download status
        inst.setDownloaded(obj.files.length);

        // Actions
        inst.auto_search.onclick = () => autosearchIssue(obj.id, api_key);
        inst.manual_search.onclick = () => showManualSearch(api_key, obj.id);
        inst.convert.onclick = () => showConvert(api_key, obj.id);
    };
};

function fillPage(data: VolumePublicInfo, api_key: string) {
    if (data.special_version_locked) {
        ViewEls.vol_edit.special_version.value = data.special_version || '';
    }
    else {
        ViewEls.vol_edit.special_version.value = 'auto';
        const sv_name = (ViewEls.vol_edit.special_version
            .querySelector(`option[value='${data.special_version || ''}']`) as HTMLElement)
            .innerText;

        (ViewEls.vol_edit.special_version
            .querySelector("option[value='auto']") as HTMLElement)
            .innerText += ` (${sv_name})`;
    };

    // Cover
    ViewEls.vol_data.cover.src = `${url_base}/api/volumes/${data.id}/cover?api_key=${api_key}`;

    // Monitored state
    ViewEls.vol_edit.monitor_new_issues.value = JSON.stringify(data.monitor_new_issues);
    const monitor = ViewEls.vol_data.monitor;

    monitor.dataset.monitored = JSON.stringify(data.monitored);
    monitor.onclick = () => toggleMonitored(api_key);
    // Volume is monitored
    if (data.monitored) {
        setIcon(monitor, icons.monitored, 'Volume is monitored. Click to unmonitor.');
    }
    // Volume is unmonitored
    else {
        setIcon(monitor, icons.unmonitored, 'Volume is unmonitored. Click to monitor.');
    }

    // Libgen URL
    ViewEls.vol_edit.libgen_edit.value = data.libgen_url ?? '';

    // Title
    ViewEls.vol_data.title.innerText = data.title;

    // Tags
    const tags = ViewEls.vol_data.tags;

    if (data.year !== null) {
        const year = document.createElement('p');
        year.innerText = data.year;
        tags.appendChild(year);
    }

    const volume_number = document.createElement('p');

    volume_number.innerText = `Volume ${data.volume_number || 1}`;
    tags.appendChild(volume_number);
    const special_version = document.createElement('p');

    special_version.innerText = data.special_version?.toUpperCase() || 'Normal volume';
    tags.appendChild(special_version);
    const total_size = document.createElement('p');

    total_size.innerText = data.total_size > 0 ? convertSize(data.total_size) : '0MB';
    tags.appendChild(total_size);
    if (data.site_url !== '') {
        const link = document.createElement('a');

        link.href = data.site_url;
        link.innerText = 'link';
        tags.appendChild(link);
    };

    // Path
    const path = ViewEls.vol_data.path;

    path.innerText = data.folder;
    path.dataset.root_folder = data.root_folder;
    path.dataset.volume_folder = data.volume_folder;

    // Descriptions
    ViewEls.vol_data.description.innerHTML = data.description;
    ViewEls.vol_data.mobile_description.innerHTML = data.description;

    // fill issue lists
    fillTable(data.issues, api_key);

    mapButtons(volume_id);

    hide([ViewEls.views.loading], [ViewEls.views.main]);

    const table = document.querySelector('#files-window tbody') as HTMLElement;

    table.innerHTML = '';
    data.general_files.forEach((gf) => {
        const entry = ViewEls.pre_build.general_files_entry
            .cloneNode(true) as typeof ViewEls.pre_build.general_files_entry;

        const short_f = gf.filepath.slice(
            gf.filepath.indexOf(data.volume_folder) +
            data.volume_folder.length +
            1,
        );
        const file_name = entry.querySelector('.gf-filepath') as HTMLElement;

        file_name.innerText = short_f;
        file_name.title = gf.filepath;

        (entry.querySelector('.gf-type') as HTMLElement).innerText = gf.file_type;
        (entry.querySelector('.gf-size') as HTMLElement).innerText = convertSize(gf.size);
        (entry.querySelector('.gf-delete button') as HTMLElement).onclick = () =>
            sendAPI('DELETE', `/files/${gf.id}`, api_key)
                .then(() => entry.remove());

        table.appendChild(entry);
    });
};

//
// Actions
//
function toggleMonitored(api_key: string) {
    const monitored = ViewEls.vol_data.monitor.dataset.monitored !== 'true';

    sendAPI('PUT', `/volumes/${volume_id}`, api_key, {}, {
        monitored,
    })
        .then(() => {
            ViewEls.vol_data.monitor.dataset.monitored = JSON.stringify(monitored);
            if (monitored) {
                setIcon(
                    ViewEls.vol_data.monitor,
                    icons.monitored,
                    'Volume is monitored. Click to unmonitor.',
                );
            }
            else {
                setIcon(
                    ViewEls.vol_data.monitor,
                    icons.unmonitored,
                    'Volume is unmonitored. Click to monitor.',
                );
            }
        });
};

//
// Tasks
//
function refreshVolume(api_key: string) {
    const button_info = task_to_button[`refresh_and_scan#${volume_id}`];
    const icon = button_info.button.querySelector('img');

    icon.src = button_info.loading_icon;
    icon.classList.add('spinning');

    sendAPI('POST', '/system/tasks', api_key, {}, {
        cmd: 'refresh_and_scan',
        volume_id,
    });
};

function autosearchVolume(api_key: string) {
    const button_info = task_to_button[`auto_search#${volume_id}`];
    const icon = button_info.button.querySelector('img');

    icon.src = button_info.loading_icon;
    icon.classList.add('spinning');

    sendAPI('POST', '/system/tasks', api_key, {}, {
        cmd: 'auto_search',
        volume_id,
    });
};

function autosearchIssue(issue_id: number, api_key: string) {
    const button_info = task_to_button[`auto_search_issue#${volume_id}#${issue_id}`];
    const icon = button_info.button.querySelector('img');

    icon.src = button_info.loading_icon;
    icon.classList.add('spinning');

    sendAPI('POST', '/system/tasks', api_key, {}, {
        cmd: 'auto_search_issue',
        volume_id,
        issue_id,
    });
};

//
// Manual search
//

function showManualSearch(api_key: string, issue_id: number | null = null) {
    const message = document.querySelector('#searching-message') as HTMLElement;

    const table = document.querySelector('#search-result-table') as HTMLElement;
    const tbody = table.querySelector('tbody')!;

    const libgenInput = document.querySelector('#libgen-input') as HTMLInputElement;
    const libgenContainer = libgenInput.parentNode as HTMLElement;

    // Display searching message and hide the rest
    hide([table, libgenContainer], [message]);
    tbody.innerHTML = '';

    const addSearchResult = (
        result: MatchedSearchResultData,
    ): [number, typeof ViewEls.pre_build.manual_search] => {
        const entry = ViewEls.pre_build.manual_search
            .cloneNode(true) as typeof ViewEls.pre_build.manual_search;

        const match = entry.querySelector('.match-column') as HTMLElement;

        if (result.match) {
            setImage(
                match,
                images.check,
                'Search result matches',
            );
        }
        else {
            setImage(
                match,
                images.cancel,
                result.match_issue ?? '',
            );
        }

        const title = entry.querySelector('a')!;

        title.href = result.link;
        title.innerText = result.display_title;

        const issueInput = entry.querySelector('.issue-column') as HTMLInputElement;
        const releaserInput = entry.querySelector('.releaser-column') as HTMLInputElement;
        const scanTypeInput = entry.querySelector('.scan-type-column') as HTMLInputElement;
        const resolutionInput = entry.querySelector('.resolution-column') as HTMLInputElement;
        const dpiInput = entry.querySelector('.dpi-column') as HTMLInputElement;

        issueInput.value = result.issue_number?.toString() ?? '';
        issueInput.style.minInlineSize = `${issueInput.value.length + 3}ch`;

        releaserInput.value = result.releaser ?? '';
        releaserInput.style.minInlineSize = `${releaserInput.value.length + 3}ch`;

        scanTypeInput.value = result.scan_type ?? '';
        scanTypeInput.style.minInlineSize = `${scanTypeInput.value.length + 3}ch`;

        resolutionInput.value = result.resolution ?? '';
        resolutionInput.style.minInlineSize = `${resolutionInput.value.length + 3}ch`;

        dpiInput.value = result.dpi ?? '';
        dpiInput.style.minInlineSize = `${dpiInput.value.length + 3}ch`;

        const editResult = (isTorrent = false) => {
            result.issue_number = parseFloat(issueInput.value);
            result.releaser = releaserInput.value;
            result.scan_type = scanTypeInput.value;
            result.resolution = resolutionInput.value;
            result.dpi = dpiInput.value;
            result.comics_id = isTorrent ? result.comics_id : null;

            return result;
        };

        (entry.querySelector('.size-column') as HTMLElement).innerText = result.filesize ?
            convertSize(result.filesize) :
            '';
        (entry.querySelector('.pages-column') as HTMLElement).innerText = result.pages?.toString() ?? '';
        (entry.querySelector('.source-column') as HTMLElement).innerText = result.source;

        const torrent_button = entry.querySelector(
            '.search-action-column :nth-child(1)',
        ) as HTMLInputElement;

        torrent_button.classList.add('icon-text-color');
        torrent_button.onclick = () => addManualSearch(
            editResult(true), false, torrent_button, api_key, issue_id,
        );

        const download_button = entry.querySelector(
            '.search-action-column :nth-child(2)',
        ) as HTMLInputElement;

        download_button.classList.add('icon-text-color');
        download_button.onclick = () => addManualSearch(
            editResult(), false, download_button, api_key, issue_id,
        );

        const force_download_button = entry.querySelector(
            '.search-action-column :nth-child(3)',
        ) as HTMLInputElement;

        force_download_button.classList.add('icon-text-color');
        force_download_button.onclick = () => addManualSearch(
            editResult(), true, force_download_button, api_key, issue_id,
        );

        const blocklist_button = entry.querySelector(
            '.search-action-column :nth-child(4)',
        ) as HTMLInputElement;

        // Show blocklist button
        if (result.match_issue === null || !result.match_issue.includes('blocklist')) {
            blocklist_button.onclick = () => blockManualSearch(
                result.link,
                result.display_title,
                volume_id,
                issue_id,
                blocklist_button,
                match,
                api_key,
            );
        }
        // No blocklist button
        else {
            blocklist_button.remove();
        }

        return [parseFloat(result.issue_number?.toString() ?? '-1'), entry];
    };

    // Show window
    WindowFuncs.showWindow('manual-search-window');

    // Start search
    const url = issue_id ?
        `/issues/${issue_id}/manualsearch` :
        `/volumes/${volume_id}/manualsearch`;

    fetchAPI(url, api_key).then((jsonObj) => {
        // TODO: add filters, maybe in Built-in Clients
        const setupTable = (results: MatchedSearchResultData[]) => {
            results
                .map((result) => addSearchResult(result))
                .sort((a, b) => a[0] - b[0])
                .forEach(([_k, elem]) => {
                    tbody.appendChild(elem);
                });

            hide([message], [table]);
        };

        const fail_r = 'Libgen series could not be found. Try again with a link to it if it exists.';

        // Handle when no matching Libgen series were found
        if (jsonObj.result.fail_reason === fail_r) {
            libgenInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    hide([libgenContainer], [message]);

                    sendAPI('POST', url, api_key, { url: libgenInput.value })
                        .then((response) => response?.json())
                        .then((jsonObj2) => {
                            tbody.innerHTML = '';
                            setupTable(jsonObj2.result);
                            hide([], [table]);
                        });
                }
            });
            hide([message, table], [libgenContainer]);
        }
        else {
            setupTable(jsonObj.result);
        }
    });
};

function addManualSearch(
    result: MatchedSearchResultData,
    force: boolean,
    button: HTMLInputElement,
    api_key: string,
    issue_id: number | null = null,
) {
    button.classList.remove('error');
    button.title = 'Download';
    const img = button.querySelector('img')!;

    img.src = `${url_base}/static/img/loading.svg`;
    img.classList.add('spinning');

    const url = issue_id ?
        `/issues/${issue_id}/download` :
        `/volumes/${volume_id}/download`;

    sendAPI('POST', url, api_key, { ...result, force_match: force })
        .then((response) => response?.json())
        .then((json) => {
            img.classList.remove('spinning');
            if (json.result.fail_reason === null) {
                img.src = `${url_base}/static/img/check.svg`;
            }
            else {
                img.src = `${url_base}/static/img/download.svg`;
                button.classList.add('error');
                button.title = json.result.fail_reason;
            };
        });
};

function blockManualSearch(
    web_link: string, web_title: string,
    vid: number | null, issue_id: number | null,
    button: HTMLInputElement, match: HTMLElement,
    api_key: string,
) {
    sendAPI('POST', '/blocklist', api_key, {}, {
        web_link,
        web_title,
        volume_id: vid,
        issue_id,
        reason_id: 4,
    })
        .then(() => {
            console.log(button, match);
            button.querySelector('img')!.src = `${url_base}/static/img/check.svg`;
            setImage(
                match,
                'cancel.svg',
                'Link is blocklisted',
            );
        });
};

//
// Renaming
//
function showRename(api_key: string, issue_id: string | null = null) {
    (document.querySelector('#selectall-input') as HTMLInputElement).checked = true;

    const rename_button = document.querySelector('#submit-rename') as HTMLInputElement;
    let url: string;

    if (issue_id === null) {
        // Preview volume rename
        url = `/volumes/${volume_id}/rename`;
        rename_button.dataset.issue_id = '';
    }
    else {
        // Preview issue rename
        url = `/issues/${issue_id}/rename`;
        rename_button.dataset.issue_id = issue_id;
    };
    fetchAPI(url, api_key).then((json: { result: PreviewRenameResult }) => {
        const empty_message = document.querySelector(
            '#rename-window .empty-rename-message',
        ) as HTMLElement;
        const table_container = document.querySelector('#rename-window .rename-preview') as HTMLElement;
        const table = table_container.querySelector('tbody')!;

        table.innerHTML = '';

        if (!Object.keys(json.result).length) {
            hide([table_container, rename_button], [empty_message]);
        }
        else {
            hide([empty_message], [table_container, rename_button]);

            Object.entries(json.result).forEach((mapping) => {
                const before_row = ViewEls.pre_build.rename_before
                    .cloneNode(true) as typeof ViewEls.pre_build.rename_before;

                table.appendChild(before_row);
                const after_row = ViewEls.pre_build.rename_after
                    .cloneNode(true) as typeof ViewEls.pre_build.rename_after;

                table.appendChild(after_row);

                (before_row.querySelector('td:last-child') as HTMLElement).innerText = mapping[0];
                (after_row.querySelector('td:last-child') as HTMLElement).innerText = mapping[1];
            });
        };
        WindowFuncs.showWindow('rename-window');
    });
};

function toggleAllRenames() {
    const checked = (document.querySelector('#selectall-input') as HTMLInputElement).checked;

    (document.querySelectorAll(
        '#rename-window tbody input[type="checkbox"]',
    ) as NodeListOf<HTMLInputElement>).forEach((e) => {
        e.checked = checked;
    });
};

function renameVolume(api_key: string, issue_id: string | null = null) {
    const checkboxes = Array.from(document.querySelectorAll(
        '#rename-window tbody input[type="checkbox"]',
    )) as HTMLInputElement[];

    if (checkboxes.every((e) => !e.checked)) {
        WindowFuncs.closeWindow();

        return;
    };

    const data: Record<string, unknown> = {
        cmd: 'mass_rename',
        volume_id,
        filepath_filter:
            checkboxes
                .filter((e) => e.checked)
                .map((e) => (e
                    .parentNode!
                    .parentNode!
                    .querySelector('td:last-child') as HTMLElement)
                    .innerText),
    };

    if (issue_id !== null) {
        data.cmd = 'mass_rename_issue';
        data.issue_id = issue_id;
    };

    sendAPI('POST', '/system/tasks', api_key, {}, data)
        .then(() => WindowFuncs.closeWindow());
};

//
// Converting
//
function loadConvertPreference(api_key: string) {
    const el = document.querySelector('#convert-preference') as HTMLElement;

    if (el.innerHTML !== '') {
        return;
    }

    fetchAPI('/settings', api_key).then((json) => {
        const pref = [
            'source',
            ...json.result.format_preference,
            'no conversion',
        ].join(' - ');

        el.innerHTML = pref;
        el.ariaLabel = `The format preference is the following: ${pref}`;
    });
};

function showConvert(api_key: string, issue_id: number | null = null) {
    (document.querySelector('#selectall-convert-input') as HTMLInputElement).checked = true;
    loadConvertPreference(api_key);

    const convert_button = document.querySelector('#submit-convert') as HTMLButtonElement;
    let url: string;

    if (issue_id === null) {
        // Preview issue conversion
        url = `/volumes/${volume_id}/convert`;
        convert_button.dataset.issue_id = '';
    }
    else {
        // Preview issue conversion
        url = `/issues/${issue_id}/convert`;
        convert_button.dataset.issue_id = issue_id.toString();
    };

    fetchAPI(url, api_key).then((json: { result: PreviewRenameResult }) => {
        const empty_rename = document.querySelector(
            '#convert-window .empty-rename-message',
        ) as HTMLElement;
        const table_container = document.querySelector('#convert-window table') as HTMLTableElement;
        const table = table_container.querySelector('tbody')!;

        table.innerHTML = '';

        if (!Object.keys(json.result).length) {
            hide([table_container, convert_button], [empty_rename]);
        }
        else {
            hide([empty_rename], [table_container, convert_button]);
            Object.entries(json.result).forEach((mapping) => {
                const before_row = ViewEls.pre_build.rename_before
                    .cloneNode(true) as typeof ViewEls.pre_build.rename_before;

                table.appendChild(before_row);
                const after_row = ViewEls.pre_build.rename_after
                    .cloneNode(true) as typeof ViewEls.pre_build.rename_after;

                table.appendChild(after_row);

                (before_row.querySelector('td:last-child') as HTMLElement).innerText = mapping[0];
                (after_row.querySelector('td:last-child') as HTMLElement).innerText = mapping[1];
            });
        };
        WindowFuncs.showWindow('convert-window');
    });
};

function toggleAllConverts() {
    const checked = (document.querySelector('#selectall-convert-input') as HTMLInputElement).checked;

    (document.querySelectorAll(
        '#convert-window tbody input[type="checkbox"]',
    ) as NodeListOf<HTMLInputElement>).forEach((e) => {
        e.checked = checked;
    });
};

function convertVolume(api_key: string, issue_id: string | null = null) {
    const checkboxes = Array.from(document.querySelectorAll(
        '#convert-window tbody input[type="checkbox"]',
    )) as HTMLInputElement[];

    if (checkboxes.every((e) => !e.checked)) {
        WindowFuncs.closeWindow();

        return;
    };

    const data: Record<string, unknown> = {
        cmd: 'mass_convert',
        volume_id,
        filepath_filter:
            checkboxes
                .filter((e) => e.checked)
                .map((e) => (e
                    .parentNode!
                    .parentNode!
                    .querySelector('td:last-child') as HTMLElement)
                    .innerText),
    };

    if (issue_id !== null) {
        data.cmd = 'mass_convert_issue';
        data.issue_id = issue_id;
    };

    sendAPI('POST', '/system/tasks', api_key, {}, data)
        .then(() => WindowFuncs.closeWindow());
};

//
// Editing
//
function showEdit(api_key: string) {
    const volume_root_folder = parseInt(ViewEls.vol_data.path.dataset.root_folder!);
    const volume_folder = ViewEls.vol_data.path.dataset.volume_folder!;

    fetchAPI('/rootfolder', api_key).then((json) => {
        ViewEls.vol_edit.root_folder.innerHTML = '';
        json.result.forEach((root_folder: RootFolder) => {
            const entry = document.createElement('option');

            entry.value = root_folder.id.toString();
            entry.innerText = root_folder.folder;
            if (root_folder.id === volume_root_folder) {
                entry.setAttribute('selected', 'true');
            };
            ViewEls.vol_edit.root_folder.appendChild(entry);
        });
        WindowFuncs.showWindow('edit-window');
    });

    ViewEls.vol_edit.monitor.value = ViewEls.vol_data.monitor.dataset.monitored!;
    ViewEls.vol_edit.monitoring_scheme.value = '';
    ViewEls.vol_edit.volume_folder.value = volume_folder;
};

function editVolume() {
    WindowFuncs.showLoadWindow('edit-window');

    const data = {
        monitored: ViewEls.vol_edit.monitor.value === 'true',
        monitor_new_issues: ViewEls.vol_edit.monitor_new_issues.value === 'true',
        root_folder: parseInt(ViewEls.vol_edit.root_folder.value),
        volume_folder: ViewEls.vol_edit.volume_folder.value,
        libgen_url: ViewEls.vol_edit.libgen_edit.value !== '' ?
            ViewEls.vol_edit.libgen_edit.value :
            null,
    };

    if (ViewEls.vol_edit.monitoring_scheme.value !== '') {
        data['monitoring_scheme'] = ViewEls.vol_edit.monitoring_scheme.value;
    }

    const so = (document.querySelector('#specialoverride-input') as HTMLInputElement).value;

    data['special_version_locked'] = so !== 'auto';
    if (so !== 'auto') {
        data['special_version'] = so || null;
    }

    usingApiKey().then((api_key) => {
        sendAPI('PUT', `/volumes/${volume_id}`, api_key, {}, data).then(() => window.location.reload());
    });
};

//
// Deleting
//
function deleteVolume() {
    const downloading_error = document.querySelector('#volume-downloading-error') as HTMLElement;
    const tasking_error = document.querySelector('#volume-tasking-error') as HTMLElement;
    const delete_folder = (document.querySelector('#delete-folder-input') as HTMLInputElement).value;

    hide([downloading_error, tasking_error]);

    usingApiKey().then((api_key) => {
        sendAPI('DELETE', `/volumes/${volume_id}`, api_key, { delete_folder })
            .then(() => {
                window.location.href = `${url_base}/`;
            })
            // eslint-disable-next-line
            .catch((e) => e.json().then((j: any) => {
                if (j.error === 'TaskForVolumeRunning') {
                    hide([downloading_error], [tasking_error]);
                }
                else if (j.error === 'VolumeDownloadedFor') {
                    hide([tasking_error], [downloading_error]);
                }
                else {
                    console.log(j);
                }
            }));
    });
};

//
// Issue info
//
function showIssueInfo(issue_id: number, api_key: string) {
    (document.querySelector(
        '#issue-rename-selector',
    ) as HTMLElement).dataset.issue_id = issue_id.toString();

    fetchAPI(`/issues/${issue_id}`, api_key).then((json) => {
        (document.querySelector('#issue-info-title') as HTMLElement).innerText =
            `${json.result.title} - #${json.result.issue_number} - ${json.result.date}`;
        (document.querySelector('#issue-info-desc') as HTMLElement).innerHTML = json.result.description;
        const files_table = document.querySelector('#issue-files-list') as HTMLElement;

        files_table.innerHTML = '';
        json.result.files.forEach((f: FileData) => {
            const entry = ViewEls.pre_build.files_entry
                .cloneNode(true) as typeof ViewEls.pre_build.files_entry;

            const vf = ViewEls.vol_data.path.dataset.volume_folder!;
            const short_f = f.filepath.slice(
                f.filepath.indexOf(vf) +
                vf.length +
                1,
            );

            (entry.querySelector('.f-filepath') as HTMLElement).innerText = short_f;
            (entry.querySelector('.f-filepath') as HTMLElement).title = f.filepath;

            (entry.querySelector('.f-size') as HTMLElement).innerText = convertSize(f.size);
            (entry.querySelector('.f-delete button') as HTMLElement).onclick = () =>
                sendAPI('DELETE', `/files/${f.id}`, api_key)
                    .then(() => entry.remove());

            files_table.appendChild(entry);
        });
        WindowFuncs.showWindow('issue-info-window');
    });
};

function showInfoWindow(window: string) {
    hide(
        Array.from(document.querySelectorAll(
            '#issue-info-window > div:nth-child(2) > div:not(#issue-info-selectors)',
        )) as HTMLDivElement[],
        [document.querySelector(`#${window}`)!],
    );
};

// code run on load

usingApiKey().then((api_key) => {
    fetchAPI(`/volumes/${volume_id}`, api_key)
        .then((json) => fillPage(json.result, api_key))
        .catch((e) => {
            if (e.status === 404) {
                window.location.href = `${url_base}/`;
            }
            else {
                console.log(e);
            }
        });

    ViewEls.tool_bar.refresh.onclick = () => refreshVolume(api_key);
    ViewEls.tool_bar.auto_search.onclick = () => autosearchVolume(api_key);
    ViewEls.tool_bar.manual_search.onclick = () => showManualSearch(api_key);
    ViewEls.tool_bar.rename.onclick = () => showRename(api_key);
    ViewEls.tool_bar.convert.onclick = () => showConvert(api_key);
    ViewEls.tool_bar.edit.onclick = () => showEdit(api_key);

    (document.querySelector('#submit-rename') as HTMLElement).onclick = (e) => renameVolume(
        api_key, (e.target as HTMLElement).dataset.issue_id || null,
    );

    (document.querySelector('#submit-convert') as HTMLElement).onclick = (e) => convertVolume(
        api_key, (e.target as HTMLElement).dataset.issue_id || null,
    );

    (document.querySelector('#issue-rename-selector') as HTMLElement).onclick = (e) => showRename(
        api_key, (e.target as HTMLElement).dataset.issue_id || null,
    );
});

ViewEls.tool_bar.files.onclick = () => WindowFuncs.showWindow('files-window');
ViewEls.tool_bar.delete.onclick = () => WindowFuncs.showWindow('delete-window');

(document.querySelector(
    '#issue-info-selector',
) as HTMLElement).onclick = () => showInfoWindow('issue-info');

(document.querySelector(
    '#issue-files-selector',
) as HTMLElement).onclick = () => showInfoWindow('issue-files');

(document.querySelector('#selectall-input') as HTMLElement).onchange = () => toggleAllRenames();
(document.querySelector('#selectall-convert-input') as HTMLElement).onchange = () => toggleAllConverts();

(document.querySelector('#edit-form') as HTMLFormElement).action = 'javascript:editVolume();';
(document.querySelector('#delete-form') as HTMLFormElement).action = 'javascript:deleteVolume();';

declare global {
    interface Window {
        deleteVolume: () => void
        editVolume: () => void
    }
}

window.deleteVolume = deleteVolume;
window.editVolume = editVolume;
