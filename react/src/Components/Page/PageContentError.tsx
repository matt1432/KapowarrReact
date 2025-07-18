// IMPORTS

// Misc
import translate from 'Utilities/String/translate';

// General Components
import ErrorBoundaryError, {
    type ErrorBoundaryErrorProps,
} from 'Components/Error/ErrorBoundaryError';

// Specific Components
import PageContentBody from './PageContentBody';

// CSS
import styles from './PageContentError.module.css';

// IMPLEMENTATIONS

function PageContentError(props: ErrorBoundaryErrorProps) {
    return (
        <div className={styles.content}>
            <PageContentBody>
                <ErrorBoundaryError {...props} message={translate('ErrorLoadingPage')} />
            </PageContentBody>
        </div>
    );
}

export default PageContentError;
