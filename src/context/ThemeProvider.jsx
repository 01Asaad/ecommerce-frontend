import { createContext, useState, useEffect, useContext, useMemo } from "react"

const ThemeContext = createContext({
    currentThemeChoice: '',
    currentActiveTheme: '',
    setTheme: () => { }
})


export const ThemeProvider = ({ children }) => {

    const [currentTheme, setCurrentTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'system';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (currentTheme === 'dark') {
            root.classList.add('dark');
            localStorage.theme = 'dark';
        } else if (currentTheme === 'light') {
            root.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
            localStorage.removeItem('theme');
        }
    }, [currentTheme]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const root = document.documentElement;

        const handleChange = () => {
            if (currentTheme === 'system') {
                if (mediaQuery.matches) {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }
            }
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [currentTheme]);

    
    useEffect(() => {
        const theme = localStorage.theme;
        const isDarkMode = theme === 'dark' ||
        (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
    }, []);
    const value = useMemo(() => ({
        currentThemeChoice: currentTheme,
        currentActiveTheme: (currentTheme === 'dark' || currentTheme === 'light' ? currentTheme : (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light")),
        setTheme: setCurrentTheme
    }), [currentTheme])

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}


export const useTheme = () => {
    return useContext(ThemeContext);
};
