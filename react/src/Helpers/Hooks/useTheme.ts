import { useRootSelector } from 'Store/createAppStore';
import themes from 'Styles/Themes';

const useTheme = (): keyof typeof themes => {
    return useRootSelector((state) => state.uiSettings.theme ?? window.Kapowarr.theme);
};

export default useTheme;

export const useThemeColor = (color: keyof typeof themes.dark): string => {
    const theme = useTheme();
    const themeVariables = themes[theme];

    return themeVariables[color];
};
