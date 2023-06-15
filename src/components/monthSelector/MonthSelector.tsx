import React, { useEffect, useState } from 'react';
import './monthSelector.css';
import { useTranslations } from '../../hooks/useTranslations';
import { saveToLocalStorage } from '../../helpers/saveToLocal';
import { getValueFromLocalStorage } from '../../helpers/getFromLocal';

type MonthOption = {
  value: number;
  label: string;
};

type Props = {
  onChange: (value: number) => void;
  language: string;
};

export const MonthSelector: React.FC<Props> = ({ onChange, language }) => {
  let { t } = useTranslations({ language });

  const monthOptions: MonthOption[] = [
    { value: 0, label: `${t.parameters.monthSelector.january}` },
    { value: 1, label: `${t.parameters.monthSelector.february}` },
    { value: 2, label: `${t.parameters.monthSelector.march}` },
    { value: 3, label: `${t.parameters.monthSelector.april}` },
    { value: 4, label: `${t.parameters.monthSelector.may}` },
    { value: 5, label: `${t.parameters.monthSelector.june}` },
    { value: 6, label: `${t.parameters.monthSelector.jule}` },
    { value: 7, label: `${t.parameters.monthSelector.august}` },
    { value: 8, label: `${t.parameters.monthSelector.september}` },
    { value: 9, label: `${t.parameters.monthSelector.october}` },
    { value: 10, label: `${t.parameters.monthSelector.november}` },
    { value: 11, label: `${t.parameters.monthSelector.december}` },
  ];

  const [selectedMonth, setSelectedMonth] = useState<MonthOption>(
    monthOptions[0]
  );

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value);
    const selectedOption = monthOptions.find(
      (option) => option.value === value
    );
    if (selectedOption) {
      setSelectedMonth(selectedOption);
      saveToLocalStorage('month', selectedOption);

      onChange(value);
    }
  };

  useEffect(() => {
    const savedMonth = getValueFromLocalStorage('month');

    if (savedMonth && typeof savedMonth === 'object') {
      setSelectedMonth(savedMonth);
    }
  }, []);

  return (
    <div className='input-container'>
      <label>
        {t.parameters.month}
        <select
          className='select'
          value={selectedMonth.value}
          onChange={handleMonthChange}
        >
          {monthOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};
