// IMPORTS

// React
import { useEffect, useState } from 'react';

// Misc
import StackTrace from 'stacktrace-js';

import translate from 'Utilities/String/translate';

// CSS
import styles from './index.module.css';

// Types
export interface ErrorBoundaryErrorProps {
    className: string;
    messageClassName: string;
    detailsClassName: string;
    message: string;
    error: Error;
    info: {
        componentStack: string;
    };
}

// IMPLEMENTATIONS

export default function ErrorBoundaryError({
    className = styles.container,
    messageClassName = styles.message,
    detailsClassName = styles.details,
    message = translate('ErrorLoadingContent'),
    error,
    info,
}: ErrorBoundaryErrorProps) {
    const [detailedError, setDetailedError] = useState<StackTrace.StackFrame[] | null>(null);

    useEffect(() => {
        if (error) {
            StackTrace.fromError(error).then((de) => {
                setDetailedError(de);
            });
        }
        else {
            setDetailedError(null);
        }
    }, [error, setDetailedError]);

    return (
        <div className={className}>
            <div className={messageClassName}>{message}</div>

            <div className={styles.imageContainer}>
                <img
                    className={styles.image}
                    src={`${window.Kapowarr.urlBase}/static/img/error.png`}
                />
            </div>

            <details className={detailsClassName}>
                {error ? <div>{error.message}</div> : null}

                {detailedError ? (
                    detailedError.map((d, index) => {
                        return (
                            <div key={index}>
                                {`  at ${d.functionName} (${d.fileName}:${d.lineNumber}:${d.columnNumber})`}
                            </div>
                        );
                    })
                ) : (
                    <div>{info.componentStack}</div>
                )}

                <div className={styles.version}>Version: {window.Kapowarr.version}</div>
            </details>
        </div>
    );
}
