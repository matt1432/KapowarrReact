import usingApiKey from './auth.js';
import { url_base, fetchAPI, sendAPI } from './general.js';

const HistoryEls = {
    table: document.querySelector('#history') as HTMLElement,
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
    entry: document.querySelector('.pre-build-els .history-entry') as HTMLTableRowElement,
};

let offset = 0;

function fillHistory(api_key: string) {
    fetchAPI('/activity/history', api_key, { offset }).then((json) => {
        HistoryEls.table.innerHTML = '';

        (json.result as Record<string, any>[]).forEach((obj) => {
            const entry = HistoryEls.entry.cloneNode(true) as typeof HistoryEls.entry;

            const title = entry.querySelector('a')!;

            title.href = obj.web_link;
            title.innerText = obj.web_title;
            title.title = obj.web_title;
            if (obj.web_sub_title !== null) {
                title.title += `\n\n${obj.web_sub_title}`;
            }

            if (obj.file_title !== null) {
                const vol_link = entry.querySelector('td:nth-child(2) a') as HTMLAnchorElement;

                vol_link.innerText = obj.file_title;
                if (obj.volume_id !== null) {
                    vol_link.href = `${url_base}/volumes/${obj.volume_id}`;
                }
            };

            if (obj.source !== null) {
                (entry.querySelector('td:nth-child(3)') as HTMLElement).innerText = obj.source;
            }

            const d = new Date(obj.downloaded_at * 1000);
            const formatted_date = `${d.toLocaleString('en-CA').slice(0, 10)} ${d.toTimeString().slice(0, 5)}`;

            (entry.querySelector('td:last-child') as HTMLElement).innerText = formatted_date;

            HistoryEls.table.appendChild(entry);
        });
    });
};

function clearHistory(api_key: string) {
    sendAPI('DELETE', '/activity/history', api_key);
    offset = 0;
    HistoryEls.page_turner.number.innerText = 'Page 1';
    HistoryEls.table.innerHTML = '';
};

function reduceOffset(api_key: string) {
    if (offset === 0) {
        return;
    }
    offset--;
    HistoryEls.page_turner.number.innerText = `Page ${offset + 1}`;
    fillHistory(api_key);
};

function increaseOffset(api_key: string) {
    if (HistoryEls.table.innerHTML === '') {
        return;
    }
    offset++;
    HistoryEls.page_turner.number.innerText = `Page ${offset + 1}`;
    fillHistory(api_key);
};

// code run on load
usingApiKey().then((api_key) => {
    fillHistory(api_key);
    HistoryEls.buttons.refresh.onclick = () => fillHistory(api_key);
    HistoryEls.buttons.clear.onclick = () => clearHistory(api_key);
    HistoryEls.page_turner.previous.onclick = () => reduceOffset(api_key);
    HistoryEls.page_turner.next.onclick = () => increaseOffset(api_key);
});
