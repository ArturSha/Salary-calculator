import React, { memo, useCallback, useState } from "react";
import { Input } from "../../components/input/Input";
import { MonthSelector } from "../../components/monthSelector/MonthSelector";
import { useTranslations } from "../../hooks/useTranslations";
import { MinutesToHourModal } from "../../pages/minutesToHourModal/MinutesToHourModal";
import svgWatch from "./watch.svg";
import question from "./question.svg";
import { BonusModal } from "../../pages/bonusModal/BonusModal";
import "./inputs.css";

interface InputsType {
  language: string;
  hours: string;
  rate: string;
  calls: string;
  bonus: string;
  isNightShift: boolean;
  year: string;
  baseHours: string;
  handleMonthChange: (value: number) => void;
  handleBonus: React.ChangeEventHandler<HTMLInputElement>;
  handleYear: React.ChangeEventHandler<HTMLInputElement>;
  handleCalls: React.ChangeEventHandler<HTMLInputElement>;
  handleBlur: React.ChangeEventHandler<HTMLInputElement>;
  handleRate: React.ChangeEventHandler<HTMLInputElement>;
  handleHours: React.ChangeEventHandler<HTMLInputElement>;
  handleBaseHours: React.ChangeEventHandler<HTMLInputElement>;
}

export const Inputs = memo((props: InputsType) => {
  const {
    rate,
    language,
    hours,
    calls,
    bonus,
    isNightShift,
    year,
    baseHours,
    handleBaseHours,
    handleHours,
    handleCalls,
    handleBlur,
    handleBonus,
    handleMonthChange,
    handleRate,
    handleYear,
  } = props;
  let { t } = useTranslations({ language });

  const [isTimeToHourModalActive, setIsTimeToHourModalActive] =
    useState<boolean>(false);

  const [isBonusModalActive, setIsBonusModalActive] = useState<boolean>(false);

  const handleBonusModal = useCallback(() => {
    setIsBonusModalActive(!isBonusModalActive);
  }, [isBonusModalActive]);

  const handleTimeModal = useCallback(() => {
    setIsTimeToHourModalActive(!isTimeToHourModalActive);
  }, [isTimeToHourModalActive]);

  return (
    <div className="container-parameters-inputs">
      <Input
        onChange={handleRate}
        min="0"
        value={rate}
        step="0.5"
        type="number"
        label={t.parameters.rate}
      />

      <Input
        value={hours}
        onChange={handleHours}
        label={t.parameters.totalHours}
        type="number"
        min="0"
        modal={true}
        modalSrc={svgWatch}
        modalOnClick={handleTimeModal}
        modalAlt="button"
        modalClassName="container-parameters-modal__svg-btn"
      />
      <Input
        value={calls}
        onChange={handleCalls}
        min="24"
        label={t.parameters.calls}
        type="number"
        onBlur={handleBlur}
      />
      <Input
        value={bonus}
        onChange={handleBonus}
        label={t.parameters.bonus}
        type="number"
        modal={true}
        modalSrc={question}
        modalClassName="container-parameters-modal__svg-btn"
        modalAlt="button"
        modalOnClick={handleBonusModal}
      />

      {isNightShift && (
        <Input
          value={baseHours}
          onChange={handleBaseHours}
          label={t.parameters.baseHours}
          type="number"
        />
      )}
      {isBonusModalActive && (
        <BonusModal
          isModalActive={isBonusModalActive}
          language={language}
          setActive={handleBonusModal}
        />
      )}
      {isTimeToHourModalActive && (
        <MinutesToHourModal
          isModalActive={isTimeToHourModalActive}
          language={language}
          setActive={handleTimeModal}
        />
      )}

      {!isNightShift ? (
        <>
          <Input
            value={year}
            onChange={handleYear}
            label={t.parameters.year}
            type="number"
          />
          <MonthSelector language={language} onChange={handleMonthChange} />
        </>
      ) : null}
    </div>
  );
});
