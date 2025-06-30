declare module '*.module.css';

interface Window {
    Kapowarr: {
        apiKey: string;
        apiRoot: string;
        instanceName: string;
        theme: 'light' | 'dark' | 'auto';
        urlBase: string;
        version: string;
    };
}
