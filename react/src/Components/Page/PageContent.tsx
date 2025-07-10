import React from 'react';
import ErrorBoundary from 'Components/Error/ErrorBoundary';
import PageContentError from './PageContentError';
import { useTitle } from 'Helpers/Hooks/useTitle';
import styles from './PageContent.module.css';

interface PageContentProps {
    className?: string;
    title?: string;
    children: React.ReactNode;
}

function PageContent({ className = styles.content, title, children }: PageContentProps) {
    useTitle(title ? `${title} - ${window.Kapowarr.instanceName}` : window.Kapowarr.instanceName);

    return (
        <ErrorBoundary errorComponent={PageContentError}>
            <div className={className}>{children}</div>
        </ErrorBoundary>
    );
}

export default PageContent;
