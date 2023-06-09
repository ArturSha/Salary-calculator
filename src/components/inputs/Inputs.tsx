import React, { useState } from 'react';
import { Input } from '../input/Input';
import { MonthSelector } from '../monthSelector/MonthSelector';
import { useTranslations } from '../../hooks/useTranslations';
import svgWatch from './watch.svg';
import './inputs.css';
import { MinutesToHourModal } from '../../pages/minutesToHourModal/MinutesToHourModal';

interface InputsType {
  language: string;
  hours: string;
  rate: string;
  calls: string;
  bonus: string;
  isNightShift: boolean;
  year: string;
  handleMonthChange: (value: number) => void;
  handleBonus: React.ChangeEventHandler<HTMLInputElement>;
  handleYear: React.ChangeEventHandler<HTMLInputElement>;
  handleCalls: React.ChangeEventHandler<HTMLInputElement>;
  handleBlur: React.ChangeEventHandler<HTMLInputElement>;
  handleRate: React.ChangeEventHandler<HTMLInputElement>;
  handleHours: React.ChangeEventHandler<HTMLInputElement>;
}

export const Inputs: React.FC<InputsType> = ({
  rate,
  language,
  hours,
  calls,
  bonus,
  isNightShift,
  year,
  handleHours,
  handleCalls,
  handleBlur,
  handleBonus,
  handleMonthChange,
  handleRate,
  handleYear,
}) => {
  let { t } = useTranslations({ language });

  const [isTimeToHourModalActive, setIsTimeToHourModalActive] =
    useState<boolean>(false);

  const handleModal = () => {
    setIsTimeToHourModalActive(!isTimeToHourModalActive);
  };

  return (
    <div className='container-parameters-inputs'>
      <Input
        onChange={handleRate}
        min='0'
        value={rate}
        step='0.5'
        type='number'
        label={t.parameters.rate}
      />

      <Input
        value={hours}
        onChange={handleHours}
        label={t.parameters.totalHours}
        type='number'
        min='0'
        modal={
          <img
            onClick={handleModal}
            className='container-parameters-modal__svg-btn'
            src={svgWatch}
            alt='btn watch'
          />
        }
      />
      <Input
        value={calls}
        onChange={handleCalls}
        min='24'
        label={t.parameters.calls}
        type='number'
        onBlur={handleBlur}
      />
      <Input
        value={bonus}
        onChange={handleBonus}
        label={t.parameters.bonus}
        type='number'
      />
      <MinutesToHourModal
        isModalActive={isTimeToHourModalActive}
        language={language}
        setActive={handleModal}
      />

      {!isNightShift ? (
        <>
          <Input
            value={year}
            onChange={handleYear}
            label={t.parameters.year}
            type='number'
          />
          <MonthSelector language={language} onChange={handleMonthChange} />
        </>
      ) : null}
    </div>
  );
};
