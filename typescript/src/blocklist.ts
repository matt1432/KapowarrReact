import usingApiKey from './auth.js';
import { fetchAPI, sendAPI } from './general.js';

/* Types */
export interface Blocklist {
    id: number
    volume_id: number | null
    issue_id: number | null

    web_link: string | null
    web_title: string | null
    web_sub_title: string | null

    download_link: string | null
    source: string | null

    reason: string
    added_at: number
}

const BlockEls = {
    table: document.querySelector('#blocklist') as HTMLElement,
    page_turner: {
        container: document.querySelector('.page-turner') as HTMLTableSectionElement,
        previous: document.querySelector('#previous-page') as HTMLButtonElement,
        next: document.querySelector('#next-page') as HTMLButtonElement,
        number: document.querySelector('#page-number') as HTMLParagraphElement,
    },
    buttons: {
        refresh: document.querySelector('#refresh-button') as HTMLButtonElement,
        clear: document.querySelector('#clear-button') as HTMLButtonElement,
    },
    entry: document.querySelector('.pre-build-els .list-entry') as HTMLTableRowElement,
};

let offset = 0;

function fillList(api_key: string) {
    fetchAPI('/blocklist', api_key, { offset }).then((json) => {
        BlockEls.table.innerHTML = '';
        (json.result as Blocklist[]).forEach((obj) => {
            const entry = BlockEls.entry.cloneNode(true) as typeof BlockEls.entry;

            const link = entry.querySelector('a')!;

            if (obj.download_link === null) {
                // GC page blocked
                link.innerText = obj.web_title ?? obj.web_link ?? '';
                link.href = obj.web_link ?? '';
            }
            else {
                // Download link blocked
                if (obj.web_title !== null) {
                    link.innerText = `${obj.web_title} - ${obj.web_sub_title}`;
                    if (obj.source !== null) {
                        link.innerText += ` - ${obj.source}`;
                    }
                }
                else {
                    link.innerText = obj.download_link;
                }

                link.href = obj.download_link;
            };

            (entry.querySelector('.reason-column') as HTMLElement).innerText = obj.reason;

            const d = new Date(obj.added_at * 1000);
            const formatted_date = `${d.toLocaleString('en-CA').slice(0, 10)} ${d.toTimeString().slice(0, 5)}`;

            (entry.querySelector('.date-column') as HTMLElement).innerText = formatted_date;

            entry.querySelector('button')!.onclick = () => deleteEntry(obj.id, api_key);

            BlockEls.table.appendChild(entry);
        });
    });
};

function deleteEntry(id: number, api_key: string) {
    sendAPI('DELETE', `/blocklist/${id}`, api_key)
        .then(() => fillList(api_key));
};

function clearList(api_key: string) {
    sendAPI('DELETE', '/blocklist', api_key);
    offset = 0;
    BlockEls.page_turner.number.innerText = 'Page 1';
    BlockEls.table.innerHTML = '';
};

function reduceOffset(api_key: string) {
    if (offset === 0) {
        return;
    }
    offset--;
    BlockEls.page_turner.number.innerText = `Page ${offset + 1}`;
    fillList(api_key);
};

function increaseOffset(api_key: string) {
    if (BlockEls.table.innerHTML === '') {
        return;
    }
    offset++;
    BlockEls.page_turner.number.innerText = `Page ${offset + 1}`;
    fillList(api_key);
};

// code run on load
usingApiKey().then((api_key) => {
    fillList(api_key);
    BlockEls.buttons.clear.onclick = () => clearList(api_key);
    BlockEls.buttons.refresh.onclick = () => fillList(api_key);
    BlockEls.page_turner.previous.onclick = () => reduceOffset(api_key);
    BlockEls.page_turner.next.onclick = () => increaseOffset(api_key);
});
