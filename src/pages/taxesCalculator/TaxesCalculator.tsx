import { useCallback, useState } from 'react';
import { Taxes } from '../../entities/taxes/Taxes';
import addComponentSvg from './plus-svgrepo-com.svg';
import './TaxesCalculator.css';
import { useTranslations } from '../../hooks/useTranslations';

interface TaxesCalculatorProps {
  language: string;
}

export const TaxesCalculator = ({ language }: TaxesCalculatorProps) => {
  const [total, setTotal] = useState<number[]>([0]);
  const handleResultChange = useCallback((amount: number, i: number) => {
    setTotal((prevTotal) => {
      const newTotal = [...prevTotal];
      newTotal[i] = amount;
      return newTotal;
    });
  }, []);

  const [components, setComponents] = useState([0]);

  const { t } = useTranslations({ language });

  const addComponentHandler = () => {
    const newComponents = [...components];
    newComponents.push(components.length);
    setComponents(newComponents);
  };

  const totalToFixed = total
    .reduce((acc, current) => acc + current, 0)
    .toFixed(3);

  return (
    <div className='taxes'>
      {components.map((el) => (
        <Taxes
          i={el}
          key={el}
          onResultChange={handleResultChange}
          language={language}
        />
      ))}
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
