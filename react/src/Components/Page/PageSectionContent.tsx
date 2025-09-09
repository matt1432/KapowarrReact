// IMPORTS

// React
import React from 'react';

// Misc
import { kinds } from 'Helpers/Props';

// General Components
import Alert from 'Components/Alert';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';

// Types
interface PageSectionContentProps {
    isFetching: boolean;
    isPopulated: boolean;
    error?: Error;
    errorMessage: string;
    children: React.ReactNode;
}

// IMPLEMENTATIONS

export default function PageSectionContent({
    isFetching,
    isPopulated,
    error,
    errorMessage,
    children,
}: PageSectionContentProps) {
    if (isFetching && !isPopulated) {
        return <LoadingIndicator />;
    }

    if (!isFetching && !!error) {
        return <Alert kind={kinds.DANGER}>{errorMessage}</Alert>;
    }

    if (isPopulated && !error) {
        return <div>{children}</div>;
    }

    return null;
}
