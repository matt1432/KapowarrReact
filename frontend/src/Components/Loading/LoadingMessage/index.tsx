// IMPORTS

// React
import { useEffect } from 'react';

// CSS
import styles from './index.module.css';

// IMPLEMENTATIONS

const messages = [
    'Upgrading Windows, your PC will restart several times. Sit back and relax.',
    '(Insert quarter)',
    'Do you come here often?',
    'What do you call 8 Hobbits? A Hobbyte.',
    'Should have used a compiled language...',
    'I think I am, therefore, I am. I think.',
    'Proving P=NP...',
    'Switching to the latest JS framework...',
    'Alt-F4 speeds things up.',
    'Everything in this universe is either a potato or not a potato',
    'Reading Terms and Conditions for you.',
];

let message: string | null = null;

export default function LoadingMessage() {
    useEffect(() => {
        const index = Math.floor(Math.random() * messages.length);
        message = messages[index];
    }, []);

    return <div className={styles.loadingMessage}>{message}</div>;
}
