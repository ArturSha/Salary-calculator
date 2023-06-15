import { useEffect, useState } from 'react';
import { countSalary } from '../../calcFunctions/getNightShiftSalary';
import { MonthSelector } from '../monthSelector/MonthSelector';
import { countDaySalary } from '../../calcFunctions/getDayShiftSalary';
import { getWorkingDaysOfMonth } from '../../calcFunctions/getWorkingHours';
import { Input } from '../input/Input';
import { Result } from '../result/Result';
import { Checkbox } from '../input/Checkbox';
import { getFivePercent } from '../../calcFunctions/getTaxFivePercent';
import { DoughnutChart } from '../doughnut/Doughnut';
import { useTranslations } from '../../hooks/useTranslations';
import { saveToLocalStorage } from '../../helpers/saveToLocal';
import { getValueFromLocalStorage } from '../../helpers/getFromLocal';
import './main.css';

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
      const savedValue = getValueFromLocalStorage(key);
      if (savedValue !== null) {
        setValue(savedValue);
      }
    });

    setExRate({ loading: true, usRate: 0 });
    const apiURL =
      'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';
    fetch(apiURL)
      .then((res) => res.json())
      .then((res) => setExRate({ loading: false, usRate: res[24].rate }))
      .catch((response) => {
        if (!response.ok) {
          setExRate({ loading: false, usRate: 0 });

          throw new Error('Failed to fetch exchange rates');
        }
      });
  }, []);

  const toggleTax = () => {
    setAddTax((addTax) => !addTax);
    const value = !addTax;
    saveToLocalStorage('tax', value);
  };

  const toggleTaxRate = () => {
    setTaxRate((taxRate) => !taxRate);
    const value = !taxRate;
    saveToLocalStorage('taxRate', value);
  };

  const toggleExchange = () => {
    setExchange((exchange) => !exchange);
  };

  const toggleNightShiftStatus = () => {
    setIsNightShift((isNightShift) => !isNightShift);
    const value = !isNightShift;
    saveToLocalStorage('isNightShift', value);
  };

  const handleRate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toString();
    if (Number(value) < 0) {
      setRate('0');
      saveToLocalStorage('rate', '0');
    } else {
      setRate(value);
      saveToLocalStorage('rate', value);
    }
  };

  const handleHours = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toString();

    if (Number(value) < 0) {
      setHours('0');
      saveToLocalStorage('hours', '0');
    } else {
      setHours(value);
      saveToLocalStorage('hours', value);
    }
  };

  const handleBonus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toString();
    if (Number(value) < 0) {
      setBonus('0');
      saveToLocalStorage('bonus', '0');
    } else {
      setBonus(value);
      saveToLocalStorage('bonus', value);
    }
  };

  const handleCalls = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toString();

    if (Number(value) > 30) {
      saveToLocalStorage('calls', '30');
      setCalls('30');
    } else {
      setCalls(value);
      saveToLocalStorage('calls', Number(value) > 23 ? value : '27');
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

  const salaryResult = countSalary({
    rate,
    hours,
    bonus,
    calls,
    addTax,
    exRate,
    exchange,
  });
  const daySalaryResult = countDaySalary({
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
    ? salaryResult.salary
    : daySalaryResult.salary;

  const tax = getFivePercent(salaryTotal, exRate.usRate, taxRate, exchange);

  const handleMonthChange = (value: number) => {
    const selectedMonth = String(value);
    setMonth(selectedMonth);
  };

  const getAllData = isNightShift
    ? [
        Number(salaryResult.baseSalary.toFixed(2)),
        Number(salaryResult.extraSalary.toFixed(2)),
        Number(salaryResult.bonus.toFixed(2)),
        Number(salaryResult.callsBonus.toFixed(2)),
        Number(salaryResult.ssb.toFixed(2)),
      ]
    : [
        Number(daySalaryResult.baseSalary.toFixed(2)),
        Number(daySalaryResult.extraSalary.toFixed(2)),
        Number(daySalaryResult.bonus.toFixed(2)),
        Number(daySalaryResult.callsBonus.toFixed(2)),
        Number(daySalaryResult.ssb.toFixed(2)),
      ];
  const dataForDoughnut = [getAllData];

  return (
    <div className='container'>
      <div className='container-options'>
        <div className='container-parameters'>
          <h2 className='options-subtitle'>{t.parameters.parameters}</h2>

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

            {!isNightShift ? (
              <>
                <Input
                  value={year}
                  onChange={handleYear}
                  label={t.parameters.year}
                  type='number'
                />
                <MonthSelector
                  language={language}
                  onChange={handleMonthChange}
                />
              </>
            ) : null}
          </div>
          <div className='checkboxes-container'>
            <Checkbox
              onChange={toggleTax}
              id='tax'
              htmlFor='tax'
              checked={addTax}
              title={t.parameters.addSSP}
            />

            <Checkbox
              onChange={toggleNightShiftStatus}
              checked={isNightShift}
              id='shift'
              htmlFor='shift'
              title={t.parameters.nightShift}
            />
          </div>
        </div>
        <div className='container-income'>
          <h2 className='options-subtitle'>{t.income.yourIncome}</h2>
          <div className='container-income-results'>
            {!isNightShift ? (
              <div className='group-result'>
                <span> {t.income.baseHours}</span>{' '}
                {baseForDayShift + ` ${t.income.hrs}`}
              </div>
            ) : null}
            <Result
              title={t.income.base}
              isNightShift={isNightShift}
              daySalary={daySalaryResult.baseSalary}
              nightSalary={salaryResult.baseSalary}
              color='#6F75F2'
            />
            <Result
              title={t.income.extra}
              isNightShift={isNightShift}
              daySalary={daySalaryResult.extraSalary}
              nightSalary={salaryResult.extraSalary}
              color='#c24848'
            />
            <Result
              title={t.income.bonus}
              isNightShift={isNightShift}
              daySalary={daySalaryResult.bonus}
              nightSalary={salaryResult.bonus}
              color='#58c248'
            />
            <Result
              title={t.income.calls}
              isNightShift={isNightShift}
              daySalary={daySalaryResult.callsBonus}
              nightSalary={salaryResult.callsBonus}
              color='#b248c2'
            />
            {addTax ? (
              <Result title={t.income.SSP} tax='43' color='#c2a748' />
            ) : null}
            <Result
              onClick={toggleExchange}
              title={t.income.total}
              isNightShift={isNightShift}
              daySalary={daySalaryResult.salary}
              nightSalary={salaryResult.salary}
              picture={true}
              exchange={exchange}
              pointer={true}
            />

            {exRate.loading ? (
              <div className='group-result'>{t.income.loading} </div>
            ) : (
              <div className='group-result'>
                <span> {t.income.exRate} </span> {exRate.usRate}
              </div>
            )}
            {exRate.loading ? (
              <div className='group-result'>{t.income.loading} </div>
            ) : (
              <div className='group-result pointer' onClick={toggleTaxRate}>
                <span>
                  {taxRate ? '5%' : '2%'} {t.income.tax}
                </span>{' '}
                {tax + ' UAH'}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='contaner-doughnut'>
        <DoughnutChart
          language={language}
          data={dataForDoughnut[0]}
          theme={theme}
        ></DoughnutChart>
      </div>
    </div>
  );
};
