import { memo } from 'react';
import './checkbox.css';
interface CheckboxType {
  onChange?: any;
  id: string;
  htmlFor: string;
  title: string;
  checked?: boolean;
}

export const Checkbox = memo((props: CheckboxType) => {
  return (
    <div className='checkbox-container'>
      <input
        className='checkbox-shift'
        type='checkbox'
        id={props.id}
        checked={props.checked}
        onChange={props.onChange}
      />
      <label className='label__checkbox' htmlFor={props.htmlFor}>
        {props.title}
        <span tabIndex={0} className='custom-checkbox'></span>
      </label>
    </div>
  );
});
