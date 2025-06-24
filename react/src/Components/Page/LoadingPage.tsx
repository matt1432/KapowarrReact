import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import LoadingMessage from 'Components/Loading/LoadingMessage';
import styles from './LoadingPage.module.css';

// TODO: set this to correct link
const kapowarrLogo = '';

function LoadingPage() {
    return (
        <div className={styles.page}>
            <img className={styles.logoFull} src={kapowarrLogo} />
            <LoadingMessage />
            <LoadingIndicator />
        </div>
    );
}

export default LoadingPage;
