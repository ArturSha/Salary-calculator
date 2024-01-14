import { useState } from 'react';
import { Taxes } from '../../entities/taxes/Taxes';
import addComponentSvg from './plus-svgrepo-com.svg';
import './TaxesCalculator.css';
import { useTranslations } from '../../hooks/useTranslations';
import { getValueFromLocalStorage } from '../../helpers/getFromLocal';

interface TaxesCalculatorProps {
  language: string;
}
const lang = getValueFromLocalStorage('settings', 'language'); //баг с рендером первого компонента

export const TaxesCalculator = ({ language }: TaxesCalculatorProps) => {
  const [total, setTotal] = useState<number[]>([0]);
  const handleResultChange = (amount: number, i: number) => {
    setTotal((prevTotal) => {
      const newTotal = [...prevTotal];
      newTotal[i] = amount;
      return newTotal;
    });
  };
  const [components, setComponents] = useState([
    <Taxes language={lang} key={0} onResultChange={handleResultChange} i={0} />,
  ]);

  const { t } = useTranslations({ language });

  const addComponentHandler = () => {
    const newComponents = [
      ...components,
      <Taxes
        language={language}
        key={components.length}
        onResultChange={handleResultChange}
        i={components.length}
      />,
    ];
    setComponents(newComponents);
  };
  const totalToFixed = total
    .reduce((acc, current) => acc + current, 0)
    .toFixed(3);

  return (
    <div className='taxes'>
      {components}
      <p className='totalAmount'>
        {t.taxes.totalAmount}
        <span>{totalToFixed} ₴</span>
      </p>
      <img
        className='addComponent'
        src={addComponentSvg}
        alt='addComponent'
        onClick={addComponentHandler}
      />
    </div>
  );
};
