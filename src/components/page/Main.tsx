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
import './main.css';

interface MainType {
  theme: boolean;
}

export const Main: React.FC<MainType> = ({ theme }) => {
  const [rate, setRate] = useState<string>('');
  const [hours, setHours] = useState<string>('0');
  const [bonus, setBonus] = useState<string>('0');
  const [calls, setCalls] = useState<string>('27');
  const [year, setYear] = useState<string>(`${new Date().getFullYear()}`);
  const [month, setMonth] = useState<string>('0');
  const [isNightShift, setIsNightShift] = useState<boolean>(false);
  const [addTax, setAddTax] = useState<boolean>(false);

  const [exRate, setExRate] = useState({ loading: false, usRate: 0 });

  const baseForDayShift = getWorkingDaysOfMonth(+year, +month);

  useEffect(() => {
    const savedRate = localStorage.getItem('rate');
    const savedShift = localStorage.getItem('isNightShift');
    const savedTax = localStorage.getItem('tax');

    if (savedRate) {
      setRate(savedRate);
    }
    if (savedShift === 'true') {
      setIsNightShift(true);
    }
    if (savedTax === 'true') {
      setAddTax(true);
    }

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
    localStorage.setItem('tax', value.toString());
  };

  const toggleNightShiftStatus = () => {
    setIsNightShift((isNightShift) => !isNightShift);
    const value = !isNightShift;
    localStorage.setItem('isNightShift', value.toString());
  };

  const handleRate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, +e.target.value).toString();
    setRate(value);
    localStorage.setItem('rate', value);
  };

  const handleHours = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, +e.target.value).toString();
    setHours(value);
  };

  const handleBonus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, +e.target.value).toString();

    setBonus(value);
  };

  const handleCalls = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, +e.target.value).toString();
    setCalls(value);
  };

  const handleYear = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, +e.target.value).toString();
    setYear(value);
  };

  const salaryResult = countSalary({ rate, hours, bonus, calls, addTax });
  const daySalaryResult = countDaySalary({
    baseForDayShift,
    rate,
    hours,
    bonus,
    calls,
    addTax,
  });

  const salaryTotal = isNightShift
    ? salaryResult.salary
    : daySalaryResult.salary;
  const tax = getFivePercent(salaryTotal, exRate.usRate);
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
          <h2 className='options-subtitle'>Parameters</h2>

          <div className='container-parameters-inputs'>
            <Input
              onChange={handleRate}
              value={rate}
              step='0.5'
              type='number'
              label='Rate'
            />

            <Input
              value={hours}
              onChange={handleHours}
              label='Total Hours'
              type='number'
            />
            <Input
              value={calls}
              onChange={handleCalls}
              label='Calls'
              type='number'
            />
            <Input
              value={bonus}
              onChange={handleBonus}
              label='Bonus/Vacation'
              type='number'
            />

            {!isNightShift ? (
              <>
                <Input
                  value={year}
                  onChange={handleYear}
                  label='Year'
                  type='number'
                />
                <MonthSelector onChange={handleMonthChange} />{' '}
              </>
            ) : null}

            <Checkbox
              onChange={toggleTax}
              id='tax'
              htmlFor='tax'
              checked={addTax}
              title='Add SSP'
            />

            <Checkbox
              onChange={toggleNightShiftStatus}
              checked={isNightShift}
              id='shift'
              htmlFor='shift'
              title='Night shift'
            />
          </div>
        </div>
        <div className='container-income'>
          <h2 className='options-subtitle'>Your Income</h2>
          <div className='container-income-results'>
            {!isNightShift ? (
              <div className='group-result'>
                <span> Base Hours</span> {baseForDayShift + ' hrs'}
              </div>
            ) : null}
            <Result
              title='Base'
              isNightShift={isNightShift}
              daySalary={daySalaryResult.baseSalary}
              nightSalary={salaryResult.baseSalary}
              color='#6F75F2'
            />
            <Result
              title='Extra'
              isNightShift={isNightShift}
              daySalary={daySalaryResult.extraSalary}
              nightSalary={salaryResult.extraSalary}
              color='#c24848'
            />
            <Result
              title='Bonus/Vacation'
              isNightShift={isNightShift}
              daySalary={daySalaryResult.bonus}
              nightSalary={salaryResult.bonus}
              color='#58c248'
            />
            <Result
              title='Calls'
              isNightShift={isNightShift}
              daySalary={daySalaryResult.callsBonus}
              nightSalary={salaryResult.callsBonus}
              color='#b248c2'
            />
            {addTax ? <Result title='SSP' tax='43' color='#c2a748' /> : null}
            <Result
              title='Total'
              isNightShift={isNightShift}
              daySalary={daySalaryResult.salary}
              nightSalary={salaryResult.salary}
            />

            {exRate.loading ? (
              <div className='group-result'>'Loading...' </div>
            ) : (
              <div className='group-result'>
                <span> NBU exchange rate </span> {exRate.usRate}
              </div>
            )}
            {exRate.loading ? (
              <div className='group-result'>'Loading...' </div>
            ) : (
              <div className='group-result'>
                <span>5% tax </span> {tax + ' UAH'}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='contaner-doughnut'>
        <DoughnutChart data={dataForDoughnut[0]} theme={theme}></DoughnutChart>
      </div>
    </div>
  );
};
