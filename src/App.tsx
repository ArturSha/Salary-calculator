import { useEffect, useState } from 'react';
import { Header } from './components/header/Header';
import { Main } from './components/page/Main';
import { saveToLocalStorage } from './helpers/saveToLocal';
import { getValueFromLocalStorage } from './helpers/getFromLocal';

const getBody = document.querySelector('body') as HTMLBodyElement;

function App() {
  const [theme, setTheme] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>('en-US');

  useEffect(() => {
    const savedLanguage = getValueFromLocalStorage('language');
    const savedTheme = getValueFromLocalStorage('theme');
    if (savedLanguage === 'ru-RU') {
      setLanguage('ru-RU');
    }
    if (!savedTheme) {
      setTheme(false);
      getBody.id = 'dark';
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setLanguage(event.target.value);
    saveToLocalStorage('language', value);
  };

  const toggleTheme = () => {
    setTheme((theme) => !theme);
    const value = theme;
    saveToLocalStorage('theme', value);

    if (!theme) {
      getBody.id = 'dark';
    } else {
      getBody.id = '';
    }
  };

  return (
    <>
      <Header
        toggleTheme={toggleTheme}
        theme={theme}
        language={language}
        handleChange={handleChange}
      />
      <Main theme={theme} language={language} />
    </>
  );
}

export default App;
