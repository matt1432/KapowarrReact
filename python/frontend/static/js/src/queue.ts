import usingApiKey from './auth.js';
import { url_base, twoDigits, fetchAPI, sendAPI, convertSize, socket } from './general.js';

/* Types */
export interface DownloadDict {
    id: number
    volume_id: number
    issue_id: number | null
    web_link: string | null
    web_title: string | null
    web_sub_title: string | null
    download_link: string
    pure_link: string
    source_type: string
    source_name: string
    type: string
    file: string
    title: string
    download_folder: string
    size: number
    status: string
    progress: number
    speed: number
}

const QEls = {
    queue: document.querySelector('#queue') as HTMLElement,
    queue_entry: document.querySelector('.pre-build-els .queue-entry') as HTMLTableRowElement,
    tool_bar: {
        remove_all: document.querySelector('#removeall-button') as HTMLButtonElement,
    },
};

//
// Filling data
//
function addQueueEntry(api_key: string, obj: DownloadDict) {
    const entry = QEls.queue_entry.cloneNode(true) as typeof QEls.queue_entry;

    entry.dataset.id = obj.id?.toString() ?? '';
    QEls.queue.appendChild(entry);

    const title = entry.querySelector('a:first-of-type') as HTMLAnchorElement;

    title.innerText = obj.title;
    title.href = `${url_base}/volumes/${obj.volume_id}`;

    const source = entry.querySelector('td:nth-child(3) a') as HTMLAnchorElement;

    source.innerText = obj.source_name.charAt(0).toUpperCase() + obj.source_name.slice(1);
    source.href = obj.web_link?.toString() ?? '';
    source.title = `Page Title:\n${obj.web_title}`;
    if (obj.web_sub_title !== null) {
        source.title += `\n\nSub Section:\n${obj.web_sub_title}`;
    }

    const index = Array.from(QEls.queue.children).indexOf(entry);

    (entry.querySelector('.move-up-dl') as HTMLButtonElement).onclick = () => moveEntry(
        obj.id, index - 1, api_key,
    );
    (entry.querySelector('.move-down-dl') as HTMLButtonElement).onclick = () => moveEntry(
        obj.id, index + 1, api_key,
    );
    (entry.querySelector('.remove-dl') as HTMLButtonElement).onclick = () => deleteEntry(
        obj.id, api_key,
    );
    (entry.querySelector('.blocklist-dl') as HTMLButtonElement).onclick = () => {
        deleteEntry(
            obj.id,
            api_key,
            true,
        );
    };

    updateQueueEntry(obj);
};

function updateQueueEntry(obj: DownloadDict) {
    const tr = document.querySelector(`#queue > tr[data-id="${obj.id}"]`) as HTMLTableRowElement;

    tr.dataset.status = obj.status;

    (tr.querySelector('td:nth-child(1)') as HTMLElement).innerText = obj.status
        .charAt(0).toUpperCase() + obj.status.slice(1);

    (tr.querySelector('td:nth-child(4)') as HTMLElement).innerText = convertSize(obj.size);

    (tr.querySelector('td:nth-child(5)') as HTMLElement).innerText = `${twoDigits(
        Math.round(obj.speed / 100000) / 10,
    )}MB/s`;

    (tr.querySelector('td:nth-child(6)') as HTMLElement).innerText = obj.size === -1 ?
        convertSize(obj.progress) :
        `${twoDigits(Math.round(obj.progress * 10) / 10)}%`;
};

function removeQueueEntry(id: number) {
    document.querySelector(`#queue > tr[data-id="${id}"]`)?.remove();
};

function fillQueue(api_key: string) {
    fetchAPI('/activity/queue', api_key).then((json) => {
        QEls.queue.innerHTML = '';

        (json.result as DownloadDict[]).forEach((obj) => {
            addQueueEntry(api_key, obj);
        });
    });
};

//
// Actions
//
function deleteAll(api_key: string) {
    sendAPI('DELETE', '/activity/queue', api_key);
};

function moveEntry(id: number, index: number, api_key: string) {
    sendAPI('PUT', `/activity/queue/${id}`, api_key, {
        index,
    }, {})
        .then((response) => {
            if (!response?.ok) {
                return;
            }

            fillQueue(api_key);
        });
}

function deleteEntry(id: number, api_key: string, blocklist = false) {
    sendAPI('DELETE', `/activity/queue/${id}`, api_key, {}, {
        blocklist,
    });
};

// code run on load

usingApiKey().then((api_key) => {
    fillQueue(api_key);
    socket.on('queue_added', (data: DownloadDict) => addQueueEntry(api_key, data));
    socket.on('queue_status', updateQueueEntry);
    socket.on('queue_ended', (data: DownloadDict) => removeQueueEntry(data.id));
    QEls.tool_bar.remove_all.onclick = () => deleteAll(api_key);
});
