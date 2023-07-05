import { useEffect, useState } from 'react';
import { Header } from './components/header/Header';
import { Main } from './pages/main/Main';
import { saveToLocalStorage } from './helpers/saveToLocal';
import { getValueFromLocalStorage } from './helpers/getFromLocal';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Archive } from './pages/archive/Archive';

const getBody = document.querySelector('body') as HTMLBodyElement;

function App() {
  const [theme, setTheme] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>('en-US');

  useEffect(() => {
    const savedLanguage = getValueFromLocalStorage('settings', 'language');
    const savedTheme = getValueFromLocalStorage('settings', 'theme');
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
    saveToLocalStorage('settings', 'language', value);
  };

  const toggleTheme = () => {
    setTheme((theme) => !theme);
    const value = theme;
    saveToLocalStorage('settings', 'theme', value);

    if (!theme) {
      getBody.id = 'dark';
    } else {
      getBody.id = '';
    }
  };

  return (
    <>
      <BrowserRouter>
        <Header
          toggleTheme={toggleTheme}
          theme={theme}
          language={language}
          handleChange={handleChange}
        />
        <Routes>
          <Route
            path='/Salary-calculator/'
            element={<Main theme={theme} language={language} />}
          ></Route>
          <Route
            path='/Salary-calculator/archive'
            element={<Archive language={language} />}
          ></Route>
          <Route
            path='*'
            element={<Navigate to='/Salary-calculator/' />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
