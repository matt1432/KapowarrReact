import usingApiKey from './auth.js';
import { fetchAPI, sendAPI } from './general.js';

/* Types */
export interface TaskHistory {
    task_name: string
    display_title: string
    run_at: number
}
export interface TaskPlanning {
    task_name: string
    display_name: string
    interval: number
    next_run: number
    last_run: number
}

const TaskEls = {
    pre_build: {
        task: document.querySelector('.pre-build-els .task-entry') as HTMLTableRowElement,
        history: document.querySelector('.pre-build-els .history-entry') as HTMLTableRowElement,
    },
    intervals: document.querySelector('#task-intervals') as HTMLElement,
    history: document.querySelector('#history') as HTMLElement,
    buttons: {
        refresh: document.querySelector('#refresh-button') as HTMLButtonElement,
        clear: document.querySelector('#clear-button') as HTMLButtonElement,
    },
};

//
// Task planning
//
function convertInterval(interval: number) {
    // seconds -> hours
    return `${Math.round(interval / 3600)} hours`;
};

function convertTime(epoch: number, future: boolean) {
    const result = Math.round(Math.abs(Date.now() / 1000 - epoch) / 3600); // delta hours

    if (future) {
        return `in ${result} hours`;
    }
    else {
        return `${result} hours ago`;
    }
};

function fillPlanning(api_key: string) {
    fetchAPI('/system/tasks/planning', api_key).then((json) => {
        TaskEls.intervals.innerHTML = '';
        json.result.forEach((e: TaskPlanning) => {
            const entry = TaskEls.pre_build.task.cloneNode(true) as typeof TaskEls.pre_build.task;

            (entry.querySelector('.name-column') as HTMLElement).innerText = e.display_name;
            (entry.querySelector(
                '.interval-column',
            ) as HTMLElement).innerText = convertInterval(e.interval);
            (entry.querySelector(
                '.prev-column',
            ) as HTMLElement).innerText = convertTime(e.last_run, false);
            (entry.querySelector(
                '.next-column',
            ) as HTMLElement).innerText = convertTime(e.next_run, true);

            TaskEls.intervals.appendChild(entry);
        });
    });
};

//
// Task history
//
function fillHistory(api_key: string) {
    fetchAPI('/system/tasks/history', api_key).then((json) => {
        TaskEls.history.innerHTML = '';
        json.result.forEach((obj: TaskHistory) => {
            const entry = TaskEls.pre_build.history.cloneNode(true) as typeof TaskEls.pre_build.history;

            (entry.querySelector('.title-column') as HTMLElement).innerText = obj.display_title;

            const d = new Date(obj.run_at * 1000);
            const formatted_date = `${d.toLocaleString('en-CA')
                .slice(0, 10)} ${d.toTimeString().slice(0, 5)}`;

            (entry.querySelector('.date-column') as HTMLElement).innerText = formatted_date;

            TaskEls.history.appendChild(entry);
        });
    });
};

function clearHistory(api_key: string) {
    sendAPI('DELETE', '/system/tasks/history', api_key);
    TaskEls.history.innerHTML = '';
};

// code run on load

usingApiKey().then((api_key) => {
    fillHistory(api_key);
    fillPlanning(api_key);
    TaskEls.buttons.refresh.onclick = () => fillHistory(api_key);
    TaskEls.buttons.clear.onclick = () => clearHistory(api_key);
});

export { };
