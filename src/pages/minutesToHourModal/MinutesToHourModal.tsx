import { memo, useCallback, useState } from 'react';
import { Input } from '../../components/input/Input';
import { Modal } from '../../components/modal/Modal';
import { useTranslations } from '../../hooks/useTranslations';
import './minutesToHourModal.css';

interface MinutesToHourModalTypes {
  isModalActive: boolean;
  language: string;
  setActive: (arg: boolean) => void;
}

export const MinutesToHourModal = memo((props: MinutesToHourModalTypes) => {
  const { isModalActive, language, setActive } = props;
  const [minutes, setMinutes] = useState<string>('0');
  let { t } = useTranslations({ language });

  const handleMinutes = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toString();

      if (Number(value) < 0) {
        setMinutes('0');
      } else {
        setMinutes(value);
      }
    },
    []
  );

  const calcMinutestoHour = useCallback((value: string) => {
    const minutes = Number(value),
      result = minutes / 60;

    return result.toFixed(2);
  }, []);
  const minutesToHour = calcMinutestoHour(minutes);

  return (
    <Modal active={isModalActive} setActive={setActive}>
      <div className='container-minutes'>
        <h2 className='container-minutes__title'>{t.modalCalc.title}</h2>
        <Input
          label={t.modalCalc.minutes}
          type='number'
          value={minutes}
          onChange={handleMinutes}
        />
        <Input
          label={t.modalCalc.result}
          type='number'
          value={minutesToHour}
          onChange={(e) => {}}
        />
      </div>
    </Modal>
  );
});
