// @ts-nocheck

const BlockEls = {
    table: document.querySelector('#blocklist'),
    page_turner: {
        container: document.querySelector('.page-turner'),
        previous: document.querySelector('#previous-page'),
        next: document.querySelector('#next-page'),
        number: document.querySelector('#page-number'),
    },
    buttons: {
        refresh: document.querySelector('#refresh-button'),
        clear: document.querySelector('#clear-button'),
    },
    entry: document.querySelector('.pre-build-els .list-entry'),
};

let offset = 0;

function fillList(api_key) {
    fetchAPI('/blocklist', api_key, { offset })
        .then((json) => {
            BlockEls.table.innerHTML = '';
            json.result.forEach((obj) => {
                const entry = BlockEls.entry.cloneNode(true);

                const link = entry.querySelector('a');

                if (obj.download_link === null) {
                // GC page blocked
                    link.innerText = obj.web_title || obj.web_link;
                    link.href = obj.web_link;
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

                entry.querySelector('.reason-column').innerText = obj.reason;

                const d = new Date(obj.added_at * 1000);
                const formatted_date = `${d.toLocaleString('en-CA').slice(0, 10)} ${
                    d.toTimeString().slice(0, 5)}`;

                entry.querySelector('.date-column').innerText = formatted_date;

                entry.querySelector('button').onclick = () => deleteEntry(obj.id, api_key);

                BlockEls.table.appendChild(entry);
            });
        });
};

function deleteEntry(id, api_key) {
    sendAPI('DELETE', `/blocklist/${id}`, api_key)
        .then(() => fillList(api_key));
};

function clearList(api_key) {
    sendAPI('DELETE', '/blocklist', api_key);
    offset = 0;
    BlockEls.page_turner.number.innerText = 'Page 1';
    BlockEls.table.innerHTML = '';
};

function reduceOffset(api_key) {
    if (offset === 0) {
        return;
    }
    offset--;
    BlockEls.page_turner.number.innerText = `Page ${offset + 1}`;
    fillList(api_key);
};

function increaseOffset(api_key) {
    if (BlockEls.table.innerHTML === '') {
        return;
    }
    offset++;
    BlockEls.page_turner.number.innerText = `Page ${offset + 1}`;
    fillList(api_key);
};

// code run on load
usingApiKey()
    .then((api_key) => {
        fillList(api_key);
        BlockEls.buttons.clear.onclick = () => clearList(api_key);
        BlockEls.buttons.refresh.onclick = () => fillList(api_key);
        BlockEls.page_turner.previous.onclick = () => reduceOffset(api_key);
        BlockEls.page_turner.next.onclick = () => increaseOffset(api_key);
    });
