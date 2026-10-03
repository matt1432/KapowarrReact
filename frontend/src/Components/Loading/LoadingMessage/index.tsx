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
    'Flipping to the next issue...',
    'Talking the inker into one more panel...',
    'Dusting off the longboxes...',
    'Reordering the back issues...',
    'Asking the colorist for five more minutes...',
    'Chasing down a missing splash page...',
    'Bagging and boarding the evidence...',
    'Alphabetizing the pull list...',
    'Arguing politely with continuity...',
    "Checking that issue #1 isn't another reboot...",
    'Separating the annuals from the regular issues...',
    'Rescuing the variant covers from the wrong stack...',
    'Straightening the spinner rack...',
    'Looking under the couch for one missing issue...',
    'Decoding legacy issue numbering...',
    'Cross-referencing secret identities...',
    'Teaching the database the difference between a volume and a Volume...',
    'Filing the one-shots where they can cause the least confusion...',
    'Putting the trades back on the shelf...',
    'Ignoring a slabbed copy that looks judgmental...',
    'Comparing cover dates with publication dates...',
    'Shuffling the reading order one last time...',
    'Waking ComicVine from its mysterious slumber...',
    'Confirming that no origin story is required...',
    'Counting capes. Recounting capes...',
    "Sharpening the penciler's pencils...",
    'Lining up the speech balloons...',
    'Making room in the longbox...',
    'Returning a borrowed issue before anyone notices...',
    'Asking the editor whether that retcon is still canon...',
    'Putting issue #12 back after issue #11...',
    'De-duplicating the multiverse...',
    'Untangling a crossover event...',
    'Turning the page very carefully...',
    'Locating the annual everyone forgot about...',
    'Checking the barcodes for secret messages...',
    'Peeling off an imaginary 35-cent price sticker...',
    'Flattening dog-ears with a stern look...',
    'Opening the Wednesday pull...',
    'Checking for an accidental double cover...',
    'Measuring the suspicious amount of shelf sag...',
    'Explaining the plan to the sidekick...',
    'Waiting for the cliffhanger to resolve...',
    'Keeping the mint copies mint...',
    'Assembling a needlessly dramatic splash page...',
    'Pretending continuity makes perfect sense...',
    'Reminding the supervillains that import is already in progress...',
];

let message: string | null = null;

export default function LoadingMessage() {
    useEffect(() => {
        const index = Math.floor(Math.random() * messages.length);
        message = messages[index];
    }, []);

    return <div className={styles.loadingMessage}>{message}</div>;
}
