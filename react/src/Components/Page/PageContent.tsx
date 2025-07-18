// IMPORTS

// React
import React from 'react';

// Misc
import { useTitle } from 'Helpers/Hooks/useTitle';

// General Components
import ErrorBoundary from 'Components/Error/ErrorBoundary';

// Specific Components
import PageContentError from './PageContentError';

// CSS
import styles from './PageContent.module.css';

// Types
interface PageContentProps {
    className?: string;
    title?: string;
    children: React.ReactNode;
}

// IMPLEMENTATIONS

function PageContent({ className = styles.content, title, children }: PageContentProps) {
    useTitle(title ? `${title} - ${window.Kapowarr.instanceName}` : window.Kapowarr.instanceName);

    return (
        <ErrorBoundary errorComponent={PageContentError}>
            <div className={className}>{children}</div>
        </ErrorBoundary>
    );
}

export default PageContent;
