// IMPORTS

// React
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router';
import { RouterProvider } from 'react-router/dom';

// Types
import type { ReactNode } from 'react';

export interface HistoryRouterProps {
    children?: ReactNode;
}

// IMPLEMENTATIONS

export const HistoryRouter = ({ children }: HistoryRouterProps) => {
    const router = createBrowserRouter(
        createRoutesFromElements(<Route path="*" element={children} />),
        {
            basename: window.Kapowarr.urlBase,
        },
    );

    return <RouterProvider router={router}></RouterProvider>;
};
