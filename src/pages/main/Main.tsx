import { useEffect, useState } from 'react';
import { countSalary } from '../../calcFunctions/getNightShiftSalary';
import { countDaySalary } from '../../calcFunctions/getDayShiftSalary';
import { getWorkingDaysOfMonth } from '../../calcFunctions/getWorkingHours';
import { getFivePercent } from '../../calcFunctions/getTaxFivePercent';
import { DoughnutChart } from '../../components/doughnut/Doughnut';
import { useTranslations } from '../../hooks/useTranslations';
import { saveToLocalStorage } from '../../helpers/saveToLocal';
import { getValueFromLocalStorage } from '../../helpers/getFromLocal';
import { Results } from '../../components/results/Results';
import { Checkboxes } from '../../components/checkboxes/Checkboxes';
import { Inputs } from '../../components/inputs/Inputs';
import { Button } from '../../components/button/Button';
import { AddToArchiveModal } from '../addToArchiveModal/AddToArchiveModal';
import './main.css';
import { getCurrentDate } from '../../helpers/getCurrentDate';

interface MainType {
  theme: boolean;
  language: string;
}

export const Main: React.FC<MainType> = ({ theme, language }) => {
  const [rate, setRate] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [bonus, setBonus] = useState<string>('');
  const [calls, setCalls] = useState<string>('27');
  const [year, setYear] = useState<string>(`${new Date().getFullYear()}`);
  const [month, setMonth] = useState<string>('0');
  const [isNightShift, setIsNightShift] = useState<boolean>(false);
  const [taxRate, setTaxRate] = useState<boolean>(true);
  const [addTax, setAddTax] = useState<boolean>(false);
  const [exRate, setExRate] = useState({ loading: false, usRate: 0 });
  const [exchange, setExchange] = useState<boolean>(false);
  const [isArchiveModalActive, setIsArchiveModalActive] = useState(false);

  let { t } = useTranslations({ language });

  const baseForDayShift = getWorkingDaysOfMonth(+year, +month);

  useEffect(() => {
    const valuePairs: [string, React.Dispatch<React.SetStateAction<any>>][] = [
      ['rate', setRate],
      ['isNightShift', setIsNightShift],
      ['tax', setAddTax],
      ['taxRate', setTaxRate],
      ['hours', setHours],
      ['bonus', setBonus],
      ['calls', setCalls],
    ];

    valuePairs.forEach(([key, setValue]) => {
      const savedValue = getValueFromLocalStorage('parameters', key);
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

          throw new Error('Failed to fetch exchange rates');
        }
      });
  }, []);

  const toggleModal = () => {
    setIsArchiveModalActive(!isArchiveModalActive);
  };

  const toggleTax = () => {
    setAddTax((addTax) => !addTax);
    const value = !addTax;
    saveToLocalStorage('parameters', 'tax', value);
  };

  const toggleTaxRate = () => {
    setTaxRate((taxRate) => !taxRate);
    const value = !taxRate;
    saveToLocalStorage('parameters', 'taxRate', value);
  };

  const toggleExchange = () => {
    setExchange((exchange) => !exchange);
  };

  const toggleNightShiftStatus = () => {
    setIsNightShift((isNightShift) => !isNightShift);
    const value = !isNightShift;
    saveToLocalStorage('parameters', 'isNightShift', value);
  };

  const handleRate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toString();
    if (Number(value) < 0) {
      setRate('0');
      saveToLocalStorage('parameters', 'rate', '0');
    } else {
      setRate(value);
      saveToLocalStorage('parameters', 'rate', value);
    }
  };

  const handleHours = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toString();

    if (Number(value) < 0) {
      setHours('0');
      saveToLocalStorage('parameters', 'hours', '0');
    } else {
      setHours(value);
      saveToLocalStorage('parameters', 'hours', value);
    }
  };

  const handleBonus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toString();
    if (Number(value) < 0) {
      setBonus('0');
      saveToLocalStorage('parameters', 'bonus', '0');
    } else {
      setBonus(value);
      saveToLocalStorage('parameters', 'bonus', value);
    }
  };

  const handleCalls = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toString();

    if (Number(value) > 30) {
      saveToLocalStorage('parameters', 'calls', '30');
      setCalls('30');
    } else {
      setCalls(value);
      saveToLocalStorage(
        'parameters',
        'calls',
        Number(value) > 23 ? value : '27'
      );
    }
  };
  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isValid = Number(calls) >= 24 && Number(calls) <= 30;
    const value = e.target.value.toString();
    if (isValid) {
      setCalls(value);
    } else {
      setCalls('27');
    }
  };

  const handleYear = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toString();
    setYear(value);
  };

  const nightShiftSalaryResult = countSalary({
    rate,
    hours,
    bonus,
    calls,
    addTax,
    exRate,
    exchange,
  });
  const dayShiftSalaryResult = countDaySalary({
    baseForDayShift,
    rate,
    hours,
    bonus,
    calls,
    addTax,
    exRate,
    exchange,
  });

  const salaryTotal = isNightShift
    ? nightShiftSalaryResult.salary
    : dayShiftSalaryResult.salary;

  const tax = getFivePercent(salaryTotal, exRate.usRate, taxRate, exchange);

  const handleMonthChange = (value: number) => {
    const selectedMonth = String(value);
    setMonth(selectedMonth);
  };

  const getAllData = isNightShift
    ? [
        Number(nightShiftSalaryResult.baseSalary.toFixed(2)),
        Number(nightShiftSalaryResult.extraSalary.toFixed(2)),
        Number(nightShiftSalaryResult.bonus.toFixed(2)),
        Number(nightShiftSalaryResult.callsBonus.toFixed(2)),
        Number(nightShiftSalaryResult.ssb.toFixed(2)),
      ]
    : [
        Number(dayShiftSalaryResult.baseSalary.toFixed(2)),
        Number(dayShiftSalaryResult.extraSalary.toFixed(2)),
        Number(dayShiftSalaryResult.bonus.toFixed(2)),
        Number(dayShiftSalaryResult.callsBonus.toFixed(2)),
        Number(dayShiftSalaryResult.ssb.toFixed(2)),
      ];
  const dataForDoughnut = [getAllData];

  return (
    <div className='container'>
      <div className='container-options'>
        <div className='container-parameters'>
          <h2 className='options-subtitle'>{t.parameters.parameters}</h2>
          <Inputs
            language={language}
            rate={rate}
            hours={hours}
            calls={calls}
            bonus={bonus}
            year={year}
            isNightShift={isNightShift}
            handleBonus={handleBonus}
            handleYear={handleYear}
            handleCalls={handleCalls}
            handleBlur={handleBlur}
            handleMonthChange={handleMonthChange}
            handleRate={handleRate}
            handleHours={handleHours}
          />

          <Checkboxes
            addTax={addTax}
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
          dayShiftSalaryResult={dayShiftSalaryResult}
          nightShiftSalaryResult={nightShiftSalaryResult}
          addTax={addTax}
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
        data={dataForDoughnut[0]}
        theme={theme}
      ></DoughnutChart>
      <AddToArchiveModal
        name={t.button.button}
        isModalActive={isArchiveModalActive}
        language={language}
        exchange={exchange}
        isNightShift={isNightShift}
        dayShiftSalaryResult={dayShiftSalaryResult}
        nightShiftSalaryResult={nightShiftSalaryResult}
        setActive={setIsArchiveModalActive}
        toggleExchange={toggleExchange}
      />
    </div>
  );
};
