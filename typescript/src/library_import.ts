import usingApiKey from './auth.js';

import WindowFuncs from './window.js'
import { hide, fetchAPI, sendAPI } from './general.js';

/* Types */
import { type VolumeMetadata } from './add_volume.js';
interface ComicVineResult {
    id: VolumeMetadata["comicvine_id"],
    title: string
    issue_count: VolumeMetadata["issue_count"]
    link: VolumeMetadata["site_url"]
}

interface ProposedImport {
    filepath: string
    file_title: string
    cv: ComicVineResult
    group_number: number
}

const LIEls = {
    pre_build: {
        li_result: document.querySelector('.pre-build-els .li-result') as HTMLTableRowElement,
        search_result: document.querySelector('.pre-build-els .search-result') as HTMLTableRowElement,
    },
    views: {
        start: document.querySelector('#start-window') as HTMLDivElement,
        no_result: document.querySelector('#no-result-window') as HTMLDivElement,
        list: document.querySelector('#list-window') as HTMLDivElement,
        loading: document.querySelector('#loading-window') as HTMLDivElement,
        no_cv: document.querySelector('#no-cv-window') as HTMLDivElement,
    },
    proposal_list: document.querySelector('.proposal-list') as HTMLElement,
    select_all: document.querySelector('#selectall-input') as HTMLInputElement,
    search: {
        window: document.querySelector('#cv-window') as HTMLTableSectionElement,
        input: document.querySelector('#search-input') as HTMLInputElement,
        results: document.querySelector('.search-results') as HTMLElement,
        container: document.querySelector('.search-results-container') as HTMLDivElement,
        bar: document.querySelector('.search-bar') as HTMLFormElement,
    },
    buttons: {
        cancel: document.querySelectorAll('.cancel-button') as NodeListOf<HTMLButtonElement>,
        run: document.querySelector('#run-import-button') as HTMLButtonElement,
        import: document.querySelector('#import-button') as HTMLButtonElement,
        import_rename: document.querySelector('#import-rename-button') as HTMLButtonElement,
    },
};

const rowid_to_filepath = {};

function loadProposal(api_key: string) {
    const params: Record<string, string | number> = {
        limit: parseInt((document.querySelector('#limit-input') as HTMLInputElement).value),
        limit_parent_folder: (document.querySelector('#folder-input') as HTMLInputElement).value,
        only_english: (document.querySelector('#lang-input') as HTMLInputElement).value,
    };
    const ffi = document.querySelector('#folder-filter-input') as HTMLInputElement;

    if (ffi.offsetParent !== null && (ffi.value || null) !== null) {
        params.folder_filter = encodeURIComponent(ffi.value);
    }

    hide(
        [LIEls.views.start, document.querySelector('#folder-filter-error')!],
        [LIEls.views.loading],
    );

    LIEls.proposal_list.innerHTML = '';
    LIEls.select_all.checked = true;

    fetchAPI('/libraryimport', api_key, params)
        .then((json) => {
            (json.result as ProposedImport[]).forEach((result, rowid) => {
                const entry = LIEls.pre_build.li_result.cloneNode(true) as typeof LIEls.pre_build.li_result;

                entry.dataset.rowid = rowid.toString();
                entry.dataset.group_number = result.group_number.toString();
                rowid_to_filepath[rowid] = {
                    cv_id: result.cv.id || null,
                    filepath: result.filepath,
                };

                const title = entry.querySelector('.file-column') as HTMLElement;

                title.innerText = result.file_title;
                title.title = result.filepath;

                const CV_link = entry.querySelector('a')!;

                CV_link.href = result.cv.link || '';
                CV_link.innerText = result.cv.title || '';

                (entry.querySelector('.issue-count') as HTMLElement).innerText = result.cv.issue_count.toString();

                entry.querySelector('button')!.onclick = () => openEditCVMatch(rowid);

                LIEls.proposal_list.appendChild(entry);
            });

            if (json.result.length > 0) {
                hide([LIEls.views.loading], [LIEls.views.list]);
            }
            else {
                hide([LIEls.views.loading], [LIEls.views.no_result]);
            }
        })
        .catch((e) => {
            e.json().then((j: {error: string}) => {
                if (j.error === 'InvalidComicVineApiKey') {
                    hide([LIEls.views.loading], [LIEls.views.no_cv]);
                }
                else if (j.error === 'InvalidKeyValue') {
                    hide(
                        [LIEls.views.loading],
                        [LIEls.views.start, document.querySelector('#folder-filter-error')!],
                    );
                }
                else {
                    console.log(j);
                }
            });
        });
};

function toggleSelectAll() {
    const checked = LIEls.select_all.checked;

    (LIEls.proposal_list.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>).forEach(
        (e) => {
            e.checked = checked;
        },
    );
};

function openEditCVMatch(rowid: number) {
    LIEls.search.window.dataset.rowid = rowid.toString();
    LIEls.search.results.innerHTML = '';
    hide([LIEls.search.container]);
    LIEls.search.input.value = '';
    WindowFuncs.showWindow('cv-window');
    LIEls.search.input.focus();
};

function editCVMatch(
    rowid: string,
    comicvine_id: string,
    site_url: string,
    title: string,
    year: string,
    issue_count: number,
    group_number: number | null = null,
) {
    let target_td: NodeListOf<HTMLInputElement>;

    if (group_number === null) {
        target_td = document.querySelectorAll(`tr[data-rowid="${rowid}"]`);
    }
    else {
        target_td = document.querySelectorAll(`tr[data-group_number="${group_number}"]`);
    }

    target_td.forEach((tr) => {
        rowid_to_filepath[tr.dataset.rowid!].cv_id = parseInt(comicvine_id);
        const link = tr.querySelector('a')!;

        link.href = site_url;
        link.innerText = `${title} (${year})`;
        (tr.querySelector('.issue-count') as HTMLElement).innerText = issue_count.toString();
    });
};

export function searchCV() {
    const input = LIEls.search.input;

    input.blur();

    usingApiKey().then((api_key) => {
        LIEls.search.results.innerHTML = '';

        fetchAPI('/volumes/search', api_key, { query: input.value }).then((json) => {
            json.result.forEach((result: VolumeMetadata) => {
                const entry = LIEls.pre_build.search_result.cloneNode(true) as typeof LIEls.pre_build.search_result;

                const title = entry.querySelector('td:nth-child(1) a') as HTMLAnchorElement;

                title.href = result.site_url;
                title.innerText = `${result.title} (${result.year})`;

                (entry.querySelector('td:nth-child(2)') as HTMLElement).innerText = result.issue_count.toString();

                const select_button = entry.querySelector('td:nth-child(3) button') as HTMLButtonElement;

                select_button.onclick = () => {
                    editCVMatch(
                        LIEls.search.window.dataset.rowid ?? '',
                        result.comicvine_id.toString(),
                        result.site_url,
                        result.title,
                        result.year?.toString() ?? '',
                        result.issue_count,
                    );
                    WindowFuncs.closeWindow();
                };

                const select_for_all_button = entry.querySelector('td:nth-child(4) button') as HTMLButtonElement;

                select_for_all_button.onclick = () => {
                    const rowid = LIEls.search.window.dataset.rowid;
                    const group_number = parseInt((document.querySelector(`tr[data-rowid="${rowid}"]`) as HTMLInputElement)
                        .dataset.group_number!);

                    editCVMatch(
                        rowid ?? '',
                        result.comicvine_id.toString(),
                        result.site_url,
                        result.title,
                        result.year?.toString() ?? '',
                        result.issue_count,
                        group_number,
                    );
                    WindowFuncs.closeWindow();
                };

                LIEls.search.results.appendChild(entry);
            });
            hide([], [LIEls.search.container]);
        });
    });
};

function importLibrary(api_key: string, rename = false) {
    const data = Array.from(LIEls.proposal_list.querySelectorAll(
        'tr:has(input[type="checkbox"]:checked)',
    ) as NodeListOf<HTMLInputElement>)
        .filter((i) => rowid_to_filepath[i.dataset.rowid!].cv_id !== null)
        .map((e) => {
            const rowid = e.dataset.rowid!;

            return {
                filepath: rowid_to_filepath[rowid].filepath,
                id: rowid_to_filepath[rowid].cv_id,
            };
        });

    hide([LIEls.views.list], [LIEls.views.loading]);
    sendAPI('POST', '/libraryimport', api_key, { rename_files: rename }, data)
        .then(() => hide([LIEls.views.loading], [LIEls.views.start]));
};

// code run on load

usingApiKey().then((api_key) => {
    LIEls.buttons.run.onclick = () => loadProposal(api_key);
    LIEls.buttons.import.onclick = () => importLibrary(api_key, false);
    LIEls.buttons.import_rename.onclick = () => importLibrary(api_key, true);
});

LIEls.search.bar.action = 'javascript:searchCV();';
LIEls.select_all.onchange = () => toggleSelectAll();
LIEls.buttons.cancel.forEach((b) => {
    b.onclick = () => hide(
        [LIEls.views.list, LIEls.views.no_result, LIEls.views.no_cv],
        [LIEls.views.start],
    );
});
