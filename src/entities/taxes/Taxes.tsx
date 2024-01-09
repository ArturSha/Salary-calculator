import { ChangeEvent, memo, useEffect, useState } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { Input } from '../../components/input/Input';
import { formatDate } from '../../helpers/formatDate';
import './Taxes.css';
import { getCurrentDateForInput } from '../../helpers/getCurrentDateForInput';

interface TaxesProps {
  language: string;
  i: number;
  onResultChange: (amount: number, i: number) => void;
}

export const Taxes = memo(({ language, onResultChange, i }: TaxesProps) => {
  const [pickedDate, setPickedDate] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [exRate, setExRate] = useState({ loading: false, usRate: 0 });
  const [roundedToPay, setRoundedToPay] = useState<number>(0);

  let { t } = useTranslations({ language });
  const inputDateHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPickedDate(newValue);

    setExRate({ loading: true, usRate: 0 });
    const apiURL = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&date=${formatDate(
      newValue
    )}&json`;
    fetch(apiURL)
      .then((res) => res.json())
      .then((res) => setExRate({ loading: false, usRate: res[0].rate }))
      .catch((response) => {
        if (!response.ok) {
          setExRate({ loading: false, usRate: 0 });

          throw new Error('Failed to fetch exchange rates');
        }
      });
  };

  const inputAmountHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (Number(value) < 0) {
      setAmount('1');
    } else {
      setAmount(value);
    }
  };
  useEffect(() => {
    const toPay = Number(amount) * exRate.usRate * 0.05;
    const roundedToPay = toPay.toFixed(4);
    setRoundedToPay(Number(roundedToPay));
    onResultChange(Number(roundedToPay), i);
  }, [amount, exRate.usRate, i, onResultChange]);

  return (
    <div className='container-taxes'>
      <div className='container-tax'>
        <Input
          value={pickedDate}
          onChange={inputDateHandler}
          label={t.taxes.labelDay}
          type='date'
          max={getCurrentDateForInput()}
          scroll={false}
        />
        <Input
          value={amount}
          onChange={inputAmountHandler}
          label={t.taxes.labelAmount}
          type='number'
          min='0'
        />
        <p className='currencyRate'>
          {t.taxes.rate}
          <span> {exRate.loading ? t.income.loading : exRate.usRate} ₴</span>
        </p>
      </div>
      <div className='container-tax'>
        <p className='currencyRate'>
          {t.taxes.toPay}
          <span>
            {exRate.loading
              ? t.income.loading
              : roundedToPay + t.taxes.currency}
          </span>
        </p>
      </div>
    </div>
  );
});
