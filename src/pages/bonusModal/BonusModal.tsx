import { Modal } from '../../components/modal/Modal';
import { useTranslations } from '../../hooks/useTranslations';
import { orthodoxEaster } from 'date-easter';
import { memo } from 'react';
import './bonusModal.css';

interface BonusModalType {
  setActive: (arg: boolean) => void;
  isModalActive: boolean;
  language: string;
}
const year = new Date().getFullYear();
const { month, day } = orthodoxEaster(year);

export const BonusModal = memo((props: BonusModalType) => {
  const { setActive, isModalActive, language } = props;
  let { t } = useTranslations({ language });

  const getTrioDay = (year: number, month: number, day: number) => {
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + 49);
    return date.toLocaleDateString();
  };

  let trinity = getTrioDay(year, month, day);

  let dayWithZero = day < 10 ? '0' + day : day;

  return (
    <Modal active={isModalActive} setActive={setActive}>
      <h1 className='modal-holiday__title'>{t.modalBonus.holidays}</h1>
      <p className='modal-holiday__subtitle'>
        <span> {t.modalBonus.newYear}:</span> <span> 01.01.{year}</span>
      </p>
      <p className='modal-holiday__subtitle'>
        <span> {t.modalBonus.easter}:</span>
        <span>
          {dayWithZero}.0{month}.{year}
        </span>
      </p>
      <p className='modal-holiday__subtitle'>
        <span> {t.modalBonus.trinity}:</span> <span>{trinity}</span>
      </p>
      <p className='modal-holiday__subtitle'>
        <span> {t.modalBonus.constitutionDay}:</span> <span>28.06.{year}</span>
      </p>
      <p className='modal-holiday__subtitle'>
        <span> {t.modalBonus.independenceDay}:</span> <span>24.08.{year}</span>
      </p>
      <p className='modal-holiday__subtitle'>
        <span> {t.modalBonus.christmas}:</span> <span>25.12.{year}</span>
      </p>
    </Modal>
  );
});
