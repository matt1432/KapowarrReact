function showWindow(id: string) {
    // Deselect all windows
    document.querySelectorAll('.window > section').forEach((window) => {
        window.removeAttribute('show-window');
    });

    // Select the correct window
    document.querySelector(`.window > section#${id}`)?.setAttribute('show-window', '');

    // Show the window
    document.querySelector('.window')?.setAttribute('show-window', '');
};

function showLoadWindow(id: string) {
    // Deselect all windows
    document.querySelectorAll('.window > section').forEach((window) => {
        window.removeAttribute('show-window');
    });

    // Select the correct window
    const loading_window = (document.querySelector(
        `.window > section#${id}`,
    ) as HTMLElement).dataset.loading_window;

    if (loading_window) {
        document.querySelector(`.window > section#${loading_window}`)?.setAttribute('show-window', '');
    }

    // Show the window
    document.querySelector('.window')?.setAttribute('show-window', '');
};

function closeWindow() {
    document.querySelector('.window')?.removeAttribute('show-window');
};

// code run on load

document.body.onkeydown = (e) => {
    if (
        e.code === 'Escape' &&
        document.querySelector('.window[show-window]')
    ) {
        e.stopImmediatePropagation();
        closeWindow();
    };
};

(document.querySelector('.window') as HTMLButtonElement).onclick = (e) => {
    e.stopImmediatePropagation();
    closeWindow();
};

(document.querySelectorAll('.window > section') as NodeListOf<HTMLButtonElement>).forEach(
    (el) => {
        el.onclick = (e) => e.stopImmediatePropagation();
    },
);

(document.querySelectorAll(
    '.window > section :where(button[title="Cancel"], button.cancel-window)',
) as NodeListOf<HTMLButtonElement>).forEach((e) => {
    e.onclick = () => closeWindow();
});

export default {
    showWindow,
    showLoadWindow,
    closeWindow,
};
