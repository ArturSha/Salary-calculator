import React from 'react';
import './button.css';

interface ButtonTypes {
  name: string;
  onClick: any;
  disabled?: boolean;
}
export const Button: React.FC<ButtonTypes> = ({ name, onClick, disabled }) => {
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
};
