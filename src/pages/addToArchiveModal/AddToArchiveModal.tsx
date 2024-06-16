import React, { RefObject, memo, useCallback, useRef, useState } from "react";
import { useTranslations } from "../../hooks/useTranslations";
import { SalaryData } from "../../calcFunctions/getDayShiftSalary";
import { saveToLocalArchive } from "../../helpers/saveToLocalArchive";
import { Result } from "../../components/result/Result";
import { Input } from "../../components/input/Input";
import { MonthSelector } from "../../components/monthSelector/MonthSelector";
import { Button } from "../../components/button/Button";
import { Modal } from "../../components/modal/Modal";
import "./addToArchiveModal.css";

interface AddToArchiveModalTypes {
  name: string;
  language: string;
  isModalActive: boolean;
  exchange: boolean;
  salaryResult: SalaryData;
  totalHours: string;
  bonusHours: string;
  calls: string;
  rate: string;
  baseForDayShift: number | string;

  setActive: (arg: boolean) => void;
  toggleExchange: () => void;
}

export const AddToArchiveModal = memo((props: AddToArchiveModalTypes) => {
  const {
    name,
    isModalActive,
    language,
    exchange,
    salaryResult,
    totalHours,
    bonusHours,
    calls,
    rate,
    baseForDayShift,
    setActive,
    toggleExchange,
  } = props;

  const [year, setYear] = useState<string>(`${new Date().getFullYear()}`);
  const handleYear = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toString();
    setYear(value);
  }, []);

  let { t } = useTranslations({ language });

  const spanRef: RefObject<HTMLSpanElement> = useRef(null);

  const handleButtonClick = useCallback(() => {
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
        attentionSecondPart,
        totalHours,
        calls,
        salaryResult.callsBonus.toFixed(1),
        rate,
        baseForDayShift,
        salaryResult.bonus.toFixed(1),
        bonusHours,
        salaryResult.baseSalary.toFixed(1),
        salaryResult.extraSalary.toFixed(1)
      );
    }
  }, [
    baseForDayShift,
    bonusHours,
    calls,
    isModalActive,
    rate,
    salaryResult.baseSalary,
    salaryResult.bonus,
    salaryResult.callsBonus,
    salaryResult.extraSalary,
    setActive,
    t.archive.exist1,
    t.archive.exist2,
    totalHours,
    year,
  ]);
  const valueRef = useRef<HTMLSelectElement>(null);

  return (
    <Modal active={isModalActive} setActive={setActive}>
      <div className="inputs-container">
        <MonthSelector language={language} saveToLocal={false} ref={valueRef} />
        <Input
          value={year}
          onChange={handleYear}
          label={t.parameters.year}
          type="number"
        />
      </div>
      <Result
        spanRef={spanRef}
        onClick={toggleExchange}
        title={t.income.total}
        salaryResult={salaryResult.salary}
        picture={true}
        exchange={exchange}
        pointer={true}
      />
      <Button name={name} onClick={handleButtonClick} />
    </Modal>
  );
});
