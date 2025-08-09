// IMPORTS

// Misc
import translate from 'Utilities/String/translate';

// General Components
import PageContent from 'Components/Page/PageContent';

// CSS
import styles from './index.module.css';

// Types
interface NotFoundProps {
    message?: string;
}

// IMPLEMENTATIONS

function NotFound({ message = translate('DefaultNotFoundMessage') }: NotFoundProps) {
    return (
        <PageContent title="MIA">
            <div className={styles.container}>
                <div className={styles.message}>{message}</div>

                <img
                    className={styles.image}
                    src={`${window.Kapowarr.urlBase}/static/img/404.png`}
                />
            </div>
        </PageContent>
    );
}

export default NotFound;
