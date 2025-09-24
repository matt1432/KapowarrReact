// IMPORTS

// React
import React, { Component, type ErrorInfo } from 'react';

// Types
interface ErrorBoundaryProps {
    children: React.ReactNode;
    errorComponent: React.ElementType;
    onModalClose?: () => void;
}

interface ErrorBoundaryState {
    error: Error | null;
    info: ErrorInfo | null;
}

// IMPLEMENTATIONS

export default class ErrorBoundary extends Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);

        this.state = {
            error: null,
            info: null,
        };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        this.setState({
            error,
            info,
        });
    }

    render() {
        const {
            children,
            errorComponent: ErrorComponent,
            onModalClose,
        } = this.props;
        const { error, info } = this.state;

        if (error) {
            return (
                <ErrorComponent
                    error={error}
                    info={info}
                    onModalClose={onModalClose}
                />
            );
        }

        return children;
    }
}
