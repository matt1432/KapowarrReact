// IMPORTS

// React
import { useEffect } from 'react';

// CSS
import styles from './index.module.css';

// IMPLEMENTATIONS

const messages = [
    'Uncrinkling the pages...',
    'Waking up the letterer...',
    'Checking the staples...',
    'Talking the inker into one more panel...',
    'Dusting off the longboxes...',
    'Asking the colorist for five more minutes...',
    'Bagging and boarding the evidence...',
    'Arguing politely with continuity...',
    'Straightening the spinner rack...',
    'Looking under the couch for one missing issue...',
    'Putting the trades back on the shelf...',
    'Ignoring a slabbed copy that looks judgmental...',
    'Confirming that no origin story is required...',
    'Counting capes. Recounting capes...',
    "Sharpening the penciler's pencils...",
    'Lining up the speech balloons...',
    'Making room in the longbox...',
    'Returning a borrowed issue before anyone notices...',
    'Asking the editor whether that retcon is still canon...',
    'Untangling a crossover event...',
    'Turning the page very carefully...',
    'Checking the barcodes for secret messages...',
    'Peeling off an imaginary 35-cent price sticker...',
    'Flattening dog-ears with a stern look...',
    'Opening the Wednesday pull...',
    'Measuring the suspicious amount of shelf sag...',
    'Explaining the plan to the sidekick...',
    'Waiting for the cliffhanger to resolve...',
    'Keeping the mint copies mint...',
    'Assembling a needlessly dramatic splash page...',
    'Pretending continuity makes perfect sense...',
];

let message: string | null = null;

export default function LoadingMessage() {
    useEffect(() => {
        const index = Math.floor(Math.random() * messages.length);
        message = messages[index];
    }, []);

    return <div className={styles.loadingMessage}>{message}</div>;
}
