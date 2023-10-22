import React, { memo, useCallback } from 'react';
import './modal.css';

interface ModalTypes {
  active: boolean;
  setActive: (arg: boolean) => void;
  children: any;
}

export const Modal = memo((props: ModalTypes) => {
  const { active, setActive, children } = props;
  const handleClick = useCallback(() => {
    setActive(false);
  }, [setActive]);
  return (
    <div onClick={handleClick} className={active ? 'modal active' : 'modal'}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={active ? 'modal__content active' : 'modal__content'}
      >
        <span onClick={handleClick} className='close__button'>
          &times;
        </span>
        {children}
      </div>
    </div>
  );
});
