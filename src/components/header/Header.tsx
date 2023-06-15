import { ToggleSwitch } from '../toggleSwitch/ToggleSwitch';

import './header.css';
import { useTranslations } from '../../hooks/useTranslations';

interface HeaderType {
  toggleTheme: () => void;
  theme: boolean;
  language: string;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Header: React.FC<HeaderType> = ({
  toggleTheme,
  theme,
  language,
  handleChange,
}) => {
  let { t } = useTranslations({ language });

  return (
    <header className='header'>
      <div className='header-language-container'>
        <select
          className='select size'
          value={language}
          onChange={handleChange}
        >
          <option value='en-US'>EN</option>
          <option value='ru-RU'>RU</option>
        </select>
      </div>
      <div className='header-theme-container'>
        <ToggleSwitch
          onClick={toggleTheme}
          onChange={toggleTheme}
          checked={theme}
          on={t.header.themeOn}
          off={t.header.themeOff}
        />
      </div>
      <h1 className='header-title'>{t.header.title}</h1>
      <p className='header-subtitle'>{t.header.subtitle}</p>
    </header>
  );
};
