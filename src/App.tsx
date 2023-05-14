import { useEffect, useState } from 'react';
import { Header } from './components/header/Header';
import { Main } from './components/page/Main';

function App() {
  const [theme, setTheme] = useState<boolean>(true);

  const getBody = document.querySelector('body') as HTMLBodyElement;

  const toggleTheme = () => {
    setTheme((theme) => !theme);
    const value = theme;
    localStorage.setItem('theme', value.toString());

    if (!theme) {
      getBody.id = 'dark';
    } else {
      getBody.id = '';
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'false') {
      setTheme(false);
      getBody.id = 'dark';
    }
  }, []);
  return (
    <>
      <Header toggleTheme={toggleTheme} theme={theme} />
      <Main theme={theme} />
    </>
  );
}

export default App;
