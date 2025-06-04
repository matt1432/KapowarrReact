// @ts-nocheck
import { url_base, volume_id, twoDigits, setIcon, setImage, hide, fetchAPI, sendAPI, icons, images, task_to_button, mapButtons, buildTaskString, spinButton, unspinButton, fillTaskQueue, handleTaskAdded, handleTaskRemoved, connectToWebSocket, sizes, convertSize, default_values, setupLocalStorage, getLocalStorage, setLocalStorage, socket } from './general.js';

// eslint-disable-next-line
function showWindow(id) {
    // Deselect all windows
    document.querySelectorAll('.window > section').forEach((window) => {
        window.removeAttribute('show-window');
    });

    // Select the correct window
    document.querySelector(`.window > section#${id}`).setAttribute('show-window', '');

    // Show the window
    document.querySelector('.window').setAttribute('show-window', '');
};

// eslint-disable-next-line
function showLoadWindow(id) {
    // Deselect all windows
    document.querySelectorAll('.window > section').forEach((window) => {
        window.removeAttribute('show-window');
    });

    // Select the correct window
    const loading_window = document.querySelector(`.window > section#${id}`).dataset.loading_window;

    if (loading_window) {
        document.querySelector(`.window > section#${loading_window}`).setAttribute('show-window', '');
    }

    // Show the window
    document.querySelector('.window').setAttribute('show-window', '');
};

function closeWindow() {
    document.querySelector('.window').removeAttribute('show-window');
};

// code run on load

document.querySelector('body').onkeydown = (e) => {
    if (
        e.code === 'Escape' &&
        document.querySelector('.window[show-window]')
    ) {
        e.stopImmediatePropagation();
        closeWindow();
    };
};

document.querySelector('.window').onclick = (e) => {
    e.stopImmediatePropagation();
    closeWindow();
};

document.querySelectorAll('.window > section').forEach(
    (el) => {
        el.onclick = (e) => e.stopImmediatePropagation();
    },
);

document.querySelectorAll(
    '.window > section :where(button[title="Cancel"], button.cancel-window)',
).forEach((e) => {
    e.onclick = () => closeWindow();
});

export default {
    showWindow,
    showLoadWindow,
    closeWindow,
};
