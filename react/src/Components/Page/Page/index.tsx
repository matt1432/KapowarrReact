// IMPORTS

// React
import React, { useCallback, useEffect, useState } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import { saveDimensions } from 'Store/Slices/App';

// Misc
import useAppPage from 'Helpers/Hooks/useAppPage';
import useSocketEvents from 'Helpers/Hooks/useSocketEvents';

// General Components
import ColorImpairedContext from 'App/ColorImpairedContext';
import ConnectionLostModal from 'App/ConnectionLostModal';

// Specific Components
import ErrorPage from '../ErrorPage';
import PageHeader from '../Header/PageHeader';
import LoadingPage from '../LoadingPage';
import PageSidebar from '../Sidebar/PageSidebar';

// CSS
import styles from './index.module.css';
import LoginPage from 'Login';

// Types
interface PageProps {
    children?: React.ReactNode;
}

// IMPLEMENTATIONS

function Page({ children = [] }: PageProps) {
    const dispatch = useRootDispatch();

    const { hasError, errors, isPopulated, needsAuth } = useAppPage();

    const { isSmallScreen } = useRootSelector((state) => state.app.dimensions);
    const { enableColorImpairedMode } = useRootSelector((state) => state.uiSettings);

    const { isSidebarVisible } = useRootSelector((state) => state.app);

    const [isConnectionLostModalOpen, setIsConnectionLostModalOpen] = useState(false);

    useSocketEvents({
        connect: () => {
            setIsConnectionLostModalOpen(false);
        },
        disconnect: () => {
            setIsConnectionLostModalOpen(true);
        },
    });

    const handleResize = useCallback(() => {
        dispatch(
            saveDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            }),
        );
    }, [dispatch]);

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    if (hasError) {
        return <ErrorPage {...errors} version={window.Kapowarr.version} />;
    }

    if (needsAuth) {
        return <LoginPage />;
    }

    if (!isPopulated) {
        return <LoadingPage />;
    }

    return (
        <ColorImpairedContext.Provider value={enableColorImpairedMode}>
            <div className={styles.page}>
                <PageHeader />

                <div className={styles.main}>
                    <PageSidebar
                        isSmallScreen={isSmallScreen}
                        isSidebarVisible={isSidebarVisible}
                    />
                    {children}
                </div>

                <ConnectionLostModal isOpen={isConnectionLostModalOpen} />
            </div>
        </ColorImpairedContext.Provider>
    );
}

export default Page;
