export const proxyTypes = {
    NONE: '',
    HTTP: 'http',
    HTTPS: 'https',
    SOCKS5: 'socks5',
    SOCKS5H: 'socks5h',
} as const;

export default proxyTypes;

export type ProxyType = (typeof proxyTypes)[keyof typeof proxyTypes];
