import React, { memo } from 'react';
import './button.css';

interface ButtonTypes {
  name: string;
  onClick: any;
  disabled?: boolean;
}
export const Button = memo((props: ButtonTypes) => {
  const { name, onClick, disabled } = props;
  return (
    <div className='container-button'>
      <button
        disabled={disabled}
        onClick={onClick}
        className='container__button'
      >
        {name}
      </button>
    </div>
  );
});
