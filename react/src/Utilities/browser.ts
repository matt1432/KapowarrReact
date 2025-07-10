const getMobileDetect = (userAgent: string) => {
    const isAndroid = (): boolean => Boolean(userAgent.match(/Android/i));
    const isIos = (): boolean => Boolean(userAgent.match(/iPhone|iPad|iPod/i));
    const isOpera = (): boolean => Boolean(userAgent.match(/Opera Mini/i));
    const isWindows = (): boolean => Boolean(userAgent.match(/IEMobile/i));
    const isSSR = (): boolean => Boolean(userAgent.match(/SSR/i));

    const isMobile = (): boolean => Boolean(isAndroid() || isIos() || isOpera() || isWindows());
    const isDesktop = (): boolean => Boolean(!isMobile() && !isSSR());
    return {
        isMobile,
        isDesktop,
        isAndroid,
        isIos,
        isSSR,
    };
};
const mobileDetect = getMobileDetect(window.navigator.userAgent);

export function isMobile() {
    return mobileDetect.isMobile();
}

export function isIOS() {
    return mobileDetect.isIos();
}

export function isFirefox() {
    return window.navigator.userAgent.toLowerCase().indexOf('firefox/') >= 0;
}
