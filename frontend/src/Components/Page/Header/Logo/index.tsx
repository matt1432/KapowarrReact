// IMPORTS

// CSS
import styles from './index.module.css';

// IMPLEMENTATIONS

export default function Logo() {
    return (
        <img
            className={styles.logo}
            src={`${window.Kapowarr.urlBase}/static/img/favicon.svg`}
            alt="Kapowarr Logo"
        />
    );
}
