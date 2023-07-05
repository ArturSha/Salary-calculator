import { ToggleSwitch } from '../toggleSwitch/ToggleSwitch';
import { useTranslations } from '../../hooks/useTranslations';
import { NavLink } from 'react-router-dom';
import './header.css';

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
      <nav className='header-navigation'>
        <NavLink
          className={({ isActive }) => (isActive ? 'link active' : 'link')}
          to={'/Salary-calculator/'}
          end
        >
          {t.header.calculator}
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? 'link active' : 'link')}
          to={'/Salary-calculator/archive'}
          end
        >
          {t.header.archive}
        </NavLink>
      </nav>
    </header>
  );
};
