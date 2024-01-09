import React, { memo } from 'react';
import { Checkbox } from '../../components/checkbox/Checkbox';
import { useTranslations } from '../../hooks/useTranslations';
import './checkboxes.css';

interface CheckboxesType {
  addTax: boolean;
  isNightShift: boolean;
  language: string;
  toggleTax: () => void;
  toggleNightShiftStatus: () => void;
}

export const Checkboxes = memo((props: CheckboxesType) => {
  const { addTax, isNightShift, language, toggleNightShiftStatus, toggleTax } =
    props;
  let { t } = useTranslations({ language });

  return (
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
  );
});
