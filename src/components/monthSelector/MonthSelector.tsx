import React, { memo, useEffect, useState } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { saveToLocalStorage } from '../../helpers/saveToLocal';
import { getValueFromLocalStorage } from '../../helpers/getFromLocal';
import './monthSelector.css';

type MonthOption = {
  value: number;
  label: string;
};

type Props = {
  language: string;
  saveToLocal?: boolean;
  onChange?: (value: number) => void;
};

export const MonthSelector: React.ForwardRefExoticComponent<
  Props & React.RefAttributes<HTMLSelectElement>
> = memo(
  React.forwardRef<HTMLSelectElement, Props>(
    ({ language, saveToLocal, onChange }, ref) => {
      let { t } = useTranslations({ language });

      const monthOptions: MonthOption[] = [
        { value: 0, label: `${t.parameters.monthSelector.january}` },
        { value: 1, label: `${t.parameters.monthSelector.february}` },
        { value: 2, label: `${t.parameters.monthSelector.march}` },
        { value: 3, label: `${t.parameters.monthSelector.april}` },
        { value: 4, label: `${t.parameters.monthSelector.may}` },
        { value: 5, label: `${t.parameters.monthSelector.june}` },
        { value: 6, label: `${t.parameters.monthSelector.july}` },
        { value: 7, label: `${t.parameters.monthSelector.august}` },
        { value: 8, label: `${t.parameters.monthSelector.september}` },
        { value: 9, label: `${t.parameters.monthSelector.october}` },
        { value: 10, label: `${t.parameters.monthSelector.november}` },
        { value: 11, label: `${t.parameters.monthSelector.december}` },
      ];

      const [selectedMonth, setSelectedMonth] = useState<MonthOption>(
        monthOptions[0]
      );

      const handleMonthChange = (
        event: React.ChangeEvent<HTMLSelectElement>
      ) => {
        const value = Number(event.target.value);
        const selectedOption = monthOptions.find(
          (option) => option.value === value
        );
        if (selectedOption) {
          setSelectedMonth(selectedOption);
          onChange?.(value);
        }
        if (selectedOption && saveToLocal === undefined) {
          saveToLocalStorage('parameters', 'month', selectedOption);
        }
      };

      useEffect(() => {
        const savedMonth = getValueFromLocalStorage('parameters', 'month');

        if (savedMonth && typeof savedMonth === 'object') {
          setSelectedMonth(savedMonth);
        }
      }, []);

      return (
        <div className='input-container'>
          <label>
            {t.parameters.month}
            <select
              ref={ref}
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
    }
  )
);
