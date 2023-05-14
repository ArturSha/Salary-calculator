import { ToggleSwitch } from '../toggleSwitch/ToggleSwitch';
import './header.css';

interface HeaderType {
  toggleTheme: () => void;
  theme: boolean;
}

export const Header: React.FC<HeaderType> = ({ toggleTheme, theme }) => {
  return (
    <header className='header'>
      <div className='header-theme-container'>
        <ToggleSwitch
          onClick={toggleTheme}
          onChange={toggleTheme}
          checked={theme}
          on={'ON'}
          off={'OFF'}
        />
      </div>
      <h1 className='header-title'>Calculator</h1>
      <p className='header-subtitle'>
        Welcome to our website, where you can use a calculator that will help
        you quickly and easily calculate your potential income based on your
        hourly rate, bonuses and call ratings.
      </p>
    </header>
  );
};
