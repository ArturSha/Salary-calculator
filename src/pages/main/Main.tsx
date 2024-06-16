import { useCallback, useEffect, useMemo, useState } from "react";
import { countSalary } from "../../calcFunctions/getNightShiftSalary";
import { countDaySalary } from "../../calcFunctions/getDayShiftSalary";
import { getWorkingDaysOfMonth } from "../../calcFunctions/getWorkingHours";
import { getFivePercent } from "../../calcFunctions/getTaxFivePercent";
import { DoughnutChart } from "../../components/doughnut/Doughnut";
import { useTranslations } from "../../hooks/useTranslations";
import { saveToLocalStorage } from "../../helpers/saveToLocal";
import { getValueFromLocalStorage } from "../../helpers/getFromLocal";
import { Results } from "../../entities/results/Results";
import { Checkboxes } from "../../entities/checkboxes/Checkboxes";
import { Inputs } from "../../entities/inputs/Inputs";
import { Button } from "../../components/button/Button";
import { AddToArchiveModal } from "../addToArchiveModal/AddToArchiveModal";
import { getCurrentDate } from "../../helpers/getCurrentDate";
import "./main.css";

interface MainType {
  theme: boolean;
  language: string;
}

export const Main: React.FC<MainType> = ({ theme, language }) => {
  const [rate, setRate] = useState<string>("");
  const [hours, setHours] = useState<string>("");
  const [bonus, setBonus] = useState<string>("");
  const [calls, setCalls] = useState<string>("27");
  const [baseHours, setBaseHours] = useState<string>("128");
  const [year, setYear] = useState<string>(`${new Date().getFullYear()}`);
  const [month, setMonth] = useState<string>("0");
  const [isNightShift, setIsNightShift] = useState<boolean>(false);
  const [taxRate, setTaxRate] = useState<boolean>(true);
  const [addSSP, setAddTax] = useState<boolean>(false);
  const [exRate, setExRate] = useState({ loading: false, usRate: 0 });
  const [exchange, setExchange] = useState<boolean>(false);
  const [isArchiveModalActive, setIsArchiveModalActive] = useState(false);

  let { t } = useTranslations({ language });

  const baseForDayShift = useMemo(() => {
    return getWorkingDaysOfMonth(+year, +month);
  }, [month, year]);

  useEffect(() => {
    const valuePairs: [string, React.Dispatch<React.SetStateAction<any>>][] = [
      ["rate", setRate],
      ["isNightShift", setIsNightShift],
      ["tax", setAddTax],
      ["taxRate", setTaxRate],
      ["hours", setHours],
      ["bonus", setBonus],
      ["calls", setCalls],
      ["baseHours", setBaseHours],
    ];

    valuePairs.forEach(([key, setValue]) => {
      const savedValue = getValueFromLocalStorage("parameters", key);
      if (savedValue !== null) {
        setValue(savedValue);
      }
    });

    setExRate({ loading: true, usRate: 0 });
    const apiURL = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&date=${getCurrentDate()}&json`;
    fetch(apiURL)
      .then((res) => res.json())
      .then((res) => setExRate({ loading: false, usRate: res[0].rate }))
      .catch((response) => {
        if (!response.ok) {
          setExRate({ loading: false, usRate: 0 });

          throw new Error("Failed to fetch exchange rates");
        }
      });
  }, []);

  const toggleModal = useCallback(() => {
    setIsArchiveModalActive(!isArchiveModalActive);
  }, [isArchiveModalActive]);

  const toggleTax = useCallback(() => {
    setAddTax((addSSP) => !addSSP);
    const value = !addSSP;
    saveToLocalStorage("parameters", "tax", value);
  }, [addSSP]);

  const toggleTaxRate = useCallback(() => {
    setTaxRate((taxRate) => !taxRate);
    const value = !taxRate;
    saveToLocalStorage("parameters", "taxRate", value);
  }, [taxRate]);

  const toggleExchange = useCallback(() => {
    setExchange((exchange) => !exchange);
  }, []);

  const toggleNightShiftStatus = useCallback(() => {
    setIsNightShift((isNightShift) => !isNightShift);
    const value = !isNightShift;
    saveToLocalStorage("parameters", "isNightShift", value);
  }, [isNightShift]);

  const handleRate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toString();
    if (Number(value) < 0) {
      setRate("0");
      saveToLocalStorage("parameters", "rate", "0");
    } else {
      setRate(value);
      saveToLocalStorage("parameters", "rate", value);
    }
  }, []);

  const handleHours = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toString();

    if (Number(value) < 0) {
      setHours("0");
      saveToLocalStorage("parameters", "hours", "0");
    } else {
      setHours(value);
      saveToLocalStorage("parameters", "hours", value);
    }
  }, []);

  const handleBonus = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toString();
    if (Number(value) < 0) {
      setBonus("0");
      saveToLocalStorage("parameters", "bonus", "0");
    } else {
      setBonus(value);
      saveToLocalStorage("parameters", "bonus", value);
    }
  }, []);

  const handleBaseHours = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toString();
      if (Number(value) < 0) {
        setBaseHours("0");
        saveToLocalStorage("parameters", "baseHours", "0");
      } else {
        setBaseHours(value);
        saveToLocalStorage("parameters", "baseHours", value);
      }
    },
    []
  );

  const handleCalls = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toString();

    if (Number(value) > 30) {
      saveToLocalStorage("parameters", "calls", "30");
      setCalls("30");
    } else {
      setCalls(value);
      saveToLocalStorage(
        "parameters",
        "calls",
        Number(value) > 23 ? value : "27"
      );
    }
  }, []);
  const handleBlur = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const isValid = Number(calls) >= 24 && Number(calls) <= 30;
      const value = e.target.value.toString();
      if (isValid) {
        setCalls(value);
      } else {
        setCalls("27");
      }
    },
    [calls]
  );

  const handleYear = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toString();
    setYear(value);
  }, []);

  const handleMonthChange = useCallback((value: number) => {
    const selectedMonth = String(value);
    setMonth(selectedMonth);
  }, []);

  const salaryResult = useMemo(() => {
    if (isNightShift) {
      return countSalary({
        addSSP,
        rate,
        hours,
        bonus,
        calls,
        exRate,
        exchange,
        baseHours,
      });
    }
    return countDaySalary({
      addSSP,
      rate,
      hours,
      bonus,
      calls,
      exRate,
      exchange,
      baseForDayShift,
    });
  }, [
    isNightShift,
    addSSP,
    rate,
    hours,
    bonus,
    calls,
    exRate,
    exchange,
    baseForDayShift,
    baseHours,
  ]);

  const tax = getFivePercent(
    salaryResult.salary,
    exRate.usRate,
    taxRate,
    exchange
  );

  const dataForDoughnut = useMemo(() => {
    return [
      Number(salaryResult.baseSalary.toFixed(2)),
      Number(salaryResult.extraSalary.toFixed(2)),
      Number(salaryResult.bonus.toFixed(2)),
      Number(salaryResult.callsBonus.toFixed(2)),
      Number(salaryResult.ssb.toFixed(2)),
    ];
  }, [
    salaryResult.baseSalary,
    salaryResult.bonus,
    salaryResult.callsBonus,
    salaryResult.extraSalary,
    salaryResult.ssb,
  ]);

  return (
    <div className="container">
      <div className="container-options">
        <div className="container-parameters">
          <h2 className="options-subtitle">{t.parameters.parameters}</h2>
          <Inputs
            baseHours={baseHours}
            language={language}
            rate={rate}
            hours={hours}
            calls={calls}
            bonus={bonus}
            year={year}
            isNightShift={isNightShift}
            handleBaseHours={handleBaseHours}
            handleBonus={handleBonus}
            handleYear={handleYear}
            handleCalls={handleCalls}
            handleBlur={handleBlur}
            handleMonthChange={handleMonthChange}
            handleRate={handleRate}
            handleHours={handleHours}
          />

          <Checkboxes
            addTax={addSSP}
            isNightShift={isNightShift}
            language={language}
            toggleTax={toggleTax}
            toggleNightShiftStatus={toggleNightShiftStatus}
          />
        </div>
        <Results
          language={language}
          isNightShift={isNightShift}
          baseForDayShift={baseForDayShift}
          salaryResult={salaryResult}
          addSSP={addSSP}
          exchange={exchange}
          exRate={exRate}
          taxRate={taxRate}
          tax={tax}
          toggleTaxRate={toggleTaxRate}
          toggleExchange={toggleExchange}
        />
        <Button name={t.button.button} onClick={toggleModal} />
      </div>

      <DoughnutChart
        language={language}
        data={dataForDoughnut}
        theme={theme}
        addSSP={addSSP}
      />

      {isArchiveModalActive && (
        <AddToArchiveModal
          name={t.button.button}
          isModalActive={isArchiveModalActive}
          language={language}
          exchange={exchange}
          salaryResult={salaryResult}
          totalHours={hours}
          bonusHours={bonus}
          calls={calls}
          rate={rate}
          baseForDayShift={isNightShift ? baseHours : baseForDayShift}
          setActive={setIsArchiveModalActive}
          toggleExchange={toggleExchange}
        />
      )}
    </div>
  );
};
