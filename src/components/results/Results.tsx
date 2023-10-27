import React, { memo } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { Result } from '../result/Result';
import { SalaryData } from '../../calcFunctions/getDayShiftSalary';
import './results.css';

interface ResultsType {
  language: string;
  isNightShift: boolean;
  baseForDayShift: number;
  salaryResult: SalaryData;
  addSSP: boolean;
  exchange: boolean;
  exRate: Partial<{ loading: boolean; usRate: number }>;
  taxRate: boolean;
  tax: number | string;
  toggleTaxRate: () => void;
  toggleExchange: () => void;
}

export const Results = memo((props: ResultsType) => {
  const {
    language,
    isNightShift,
    baseForDayShift,
    salaryResult,
    addSSP,
    exchange,
    exRate,
    taxRate,
    tax,
    toggleExchange,
    toggleTaxRate,
  } = props;
  let { t } = useTranslations({ language });

  return (
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
          salaryResult={salaryResult.baseSalary}
          color='#6F75F2'
        />
        <Result
          title={t.income.extra}
          salaryResult={salaryResult.extraSalary}
          color='#c24848'
        />
        <Result
          title={t.income.bonus}
          salaryResult={salaryResult.bonus}
          color='#58c248'
        />
        <Result
          title={t.income.calls}
          salaryResult={salaryResult.callsBonus}
          color='#b248c2'
        />
        {addSSP ? (
          <Result title={t.income.SSP} tax='43' color='#c2a748' />
        ) : null}
        <Result
          onClick={toggleExchange}
          title={t.income.total}
          salaryResult={salaryResult.salary}
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
  );
});
