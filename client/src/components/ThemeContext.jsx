import { createContext, useState } from 'react';
import { lightColors, darkColors } from './themeColors';

export const ThemeContext = createContext();

const darkTheme = {
  colors: {
    ...darkColors,
    primaryButtonBg: '#FF751A',
    secondaryButtonBg: '#333',
  },
  type: 'dark',
};

const lightTheme = {
  colors: {
    ...lightColors,
    primaryButtonBg: '#3385FF',
    secondaryButtonBg: '#ffffff',
  },
  type: 'light',
  shadows: {
    cardShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    buttonShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [theme, setTheme] = useState(darkTheme);

  const toggleTheme = () => {
    const newIsDarkTheme = !isDarkTheme;
    setIsDarkTheme(newIsDarkTheme);
    setTheme(newIsDarkTheme ? darkTheme : lightTheme);
    localStorage.setItem('theme', newIsDarkTheme ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
