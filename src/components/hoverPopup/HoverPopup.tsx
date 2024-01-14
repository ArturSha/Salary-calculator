import { memo } from 'react';
import './HoverPopup.css';
import { useTranslations } from '../../hooks/useTranslations';
interface HoverPopupProps {
  direction: string;
  language: string;
  baseHours: number | null;
  bonus: number;
  bonusHours: string;
  callsRate: string;
  rate: string;
  totalHours: string;
  callsBonus: string;
  baseSalary: string;
  extraSalary: string;
}

export const HoverPopup = memo(
  ({
    direction,
    language,
    baseHours,
    totalHours,
    bonus,
    bonusHours,
    callsRate,
    rate,
    callsBonus,
    baseSalary,
    extraSalary,
  }: HoverPopupProps) => {
    const { t } = useTranslations({ language });
    if (!rate) {
      return null;
    }
    // Использую условный рендер, т.к. архив дорабатывался и часть данных отсутствует.
    return (
      <div className={`hoverPopup ${direction}`}>
        {baseHours && (
          <p>
            {t.archive.baseHours}
            {baseHours + t.archive.hrs}
          </p>
        )}
        {rate && (
          <p>
            {t.archive.rate}
            {rate + ' $'}
          </p>
        )}
        {totalHours && (
          <p>
            {t.archive.totalHours}
            {totalHours + t.archive.hrs}
          </p>
        )}
        {baseSalary && (
          <p>
            {t.archive.baseAndExtra}
            {` (${baseSalary} $) (${extraSalary} $)`}
          </p>
        )}
        {bonusHours && (
          <p>
            {t.archive.bonus}
            {bonusHours + t.archive.hrs}
            {` (${bonus} $)`}
          </p>
        )}
        {callsRate && (
          <p>
            {t.archive.calls}
            {callsRate} {` (${callsBonus} $)`}
          </p>
        )}
      </div>
    );
  }
);
