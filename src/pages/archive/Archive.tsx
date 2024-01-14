import React, { useEffect, useState } from 'react';
import basket from './bin.svg';
import { downloadPDF } from '../../helpers/downloadPDF';
import { useTranslations } from '../../hooks/useTranslations';
import { Button } from '../../components/button/Button';
import { Month, Root, Root2 } from './archiveTypes';
import './archive.css';
import { HoverPopup } from '../../components/hoverPopup/HoverPopup';
import { useMousePosition } from '../../hooks/useMousePosition';

interface ArchiveTypes {
  language: string;
}

export const Archive: React.FC<ArchiveTypes> = ({ language }) => {
  const [salary, setSalary] = useState<Root>([]);
  const { mouseY, direction, handleMouseMove } = useMousePosition();
  console.log(mouseY);

  let { t } = useTranslations({ language });

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('archive');
      setSalary(savedData ? JSON.parse(savedData) : []);
    } catch (error) {
      console.error('Ошибка при загрузке данных из localStorage:', error);
    }
  }, []);

  const saveSalaryToLocalStorage = (data: Root) => {
    try {
      localStorage.setItem('archive', JSON.stringify(data));
    } catch (error) {
      console.error('Ошибка при сохранении данных в localStorage:', error);
    }
  };

  const deleteYear = (year: string) => {
    const confirmed = window.confirm(
      `${t.modalConfirm.firstPart} ${year} ${t.modalConfirm.secondPart}`
    );
    if (confirmed) {
      setSalary((prevSalary: Root) => {
        const updatedSalary = [...prevSalary];
        const yearIndex = updatedSalary.findIndex(
          (item: Root2) => item.year === year
        );
        if (yearIndex !== -1) {
          updatedSalary.splice(yearIndex, 1);
          saveSalaryToLocalStorage(updatedSalary);
        }
        return updatedSalary;
      });
    }
  };

  const deleteMonth = (year: string, monthIndex: number) => {
    setSalary((prevSalary: Root) => {
      const updatedSalary = [...prevSalary];
      const yearIndex = updatedSalary.findIndex(
        (item: Root2) => item.year === year
      );

      if (yearIndex !== -1) {
        updatedSalary[yearIndex].months.splice(monthIndex, 1);

        if (updatedSalary[yearIndex].months.length === 0) {
          updatedSalary.splice(yearIndex, 1);
        }

        saveSalaryToLocalStorage(updatedSalary);
      }

      return updatedSalary;
    });
  };

  return (
    <>
      <div className='archive-container'>
        {salary.map((item: Root2, index: number) => {
          const totalSalary = item.months.reduce(
            (accumulator: number, month: Month) =>
              accumulator + parseFloat(month.salary),
            0
          );

          return (
            <div className='archive-salary-container' key={index}>
              <h2 className='archive-salary__title'>
                {item.year}
                <img
                  onClick={() => deleteYear(item.year)}
                  className='delete__button year'
                  src={basket}
                  alt='delete'
                />
              </h2>
              <ul>
                {item.months.map((month: Month, monthIndex: number) => (
                  <li
                    onMouseMove={handleMouseMove}
                    className='archive-salary-item'
                    key={monthIndex}
                  >
                    <HoverPopup
                      baseHours={month.baseHours}
                      bonus={month.bonus}
                      bonusHours={month.bonusHours}
                      callsRate={month.callsRate}
                      rate={month.rate}
                      totalHours={month.totalHours}
                      direction={direction}
                      language={language}
                      callsBonus={month.callsBonus}
                      baseSalary={month.baseSalary}
                      extraSalary={month.extraSalary}
                    />

                    <span>{month.month}:</span>
                    <span>{month.salary.toLocaleString()}</span>
                    <img
                      onClick={() => deleteMonth(item.year, monthIndex)}
                      className='delete__button'
                      src={basket}
                      alt='delete'
                    />
                  </li>
                ))}
                <li className='archive-salary-item'>
                  <span>{t.archive.total}</span>
                  <span>{totalSalary.toLocaleString()}</span>
                </li>
              </ul>
            </div>
          );
        })}
        {salary.length ? (
          <Button
            name={t.button.buttonPDF}
            onClick={() => downloadPDF(salary, language)}
          />
        ) : null}
      </div>
    </>
  );
};
