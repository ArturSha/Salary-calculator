import React, { useState } from 'react';
import './monthSelector.css';

type MonthOption = {
  value: number;
  label: string;
};

const monthOptions: MonthOption[] = [
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, label: 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' },
];

type Props = {
  onChange: (value: number) => void;
};

export const MonthSelector: React.FC<Props> = ({ onChange }) => {
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
      onChange(value);
    }
  };

  return (
    <div className='input-container'>
      <label className='label-select'>
        Month
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
