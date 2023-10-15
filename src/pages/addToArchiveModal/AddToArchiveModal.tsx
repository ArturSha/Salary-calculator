import React, { RefObject, useRef, useState } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { SalaryData } from '../../calcFunctions/getDayShiftSalary';
import { saveToLocalArchive } from '../../helpers/saveToLocalArchive';
import { Result } from '../../components/result/Result';
import { Input } from '../../components/input/Input';
import { MonthSelector } from '../../components/monthSelector/MonthSelector';
import { Button } from '../../components/button/Button';
import { Modal } from '../../components/modal/Modal';
import './addToArchiveModal.css';

interface AddToArchiveModalTypes {
  name: string;
  language: string;
  isModalActive: boolean;
  exchange: boolean;
  isNightShift: boolean;
  dayShiftSalaryResult: SalaryData;
  nightShiftSalaryResult: SalaryData;
  setActive: (arg: boolean) => void;
  toggleExchange: () => void;
}

export const AddToArchiveModal: React.FC<AddToArchiveModalTypes> = ({
  name,
  isModalActive,
  language,
  exchange,
  isNightShift,
  dayShiftSalaryResult,
  nightShiftSalaryResult,
  setActive,
  toggleExchange,
}) => {
  const [month, setMonth] = useState<string>('0');
  const [year, setYear] = useState<string>(`${new Date().getFullYear()}`);
  const handleYear = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toString();
    setYear(value);
  };

  let { t } = useTranslations({ language });

  const handleMonthChange = (value: number) => {
    const selectedMonth = String(value);
    setMonth(selectedMonth);
  };
  const spanRef: RefObject<HTMLSpanElement> = useRef(null);
  const handleButtonClick = () => {
    let selectedIndex = valueRef.current?.selectedIndex;
    let selectedOptionText;
    if (selectedIndex !== undefined) {
      selectedOptionText = valueRef.current?.options[selectedIndex].text;
    }

    let attentionFirstPart = t.archive.exist1;
    let attentionSecondPart = t.archive.exist2;

    setActive(!isModalActive);
    if (spanRef.current) {
      const salary = spanRef.current.innerHTML;
      saveToLocalArchive(
        year,
        selectedOptionText,
        selectedIndex,
        salary,
        attentionFirstPart,
        attentionSecondPart
      );
    }
  };
  const valueRef = useRef<HTMLSelectElement>(null);

  return (
    <Modal active={isModalActive} setActive={setActive}>
      <div className='inputs-container'>
        <MonthSelector
          language={language}
          saveToLocal={false}
          onChange={handleMonthChange}
          ref={valueRef}
        />
        <Input
          value={year}
          onChange={handleYear}
          label={t.parameters.year}
          type='number'
        />
      </div>
      <Result
        spanRef={spanRef}
        onClick={toggleExchange}
        title={t.income.total}
        isNightShift={isNightShift}
        daySalary={dayShiftSalaryResult.salary}
        nightSalary={nightShiftSalaryResult.salary}
        picture={true}
        exchange={exchange}
        pointer={true}
      />
      <Button name={name} onClick={handleButtonClick} />
    </Modal>
  );
};
