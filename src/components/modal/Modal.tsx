import React, { memo, useCallback, useEffect } from 'react';
import './modal.css';

interface ModalTypes {
  active: boolean;
  setActive: (arg: boolean) => void;
  children: any;
}

export const Modal = memo((props: ModalTypes) => {
  const { active, setActive, children } = props;

  const handleClose = useCallback(() => {
    setActive(false);
  }, [setActive]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && active) {
        handleClose();
      }
    },
    [active, handleClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div onClick={handleClose} className={active ? 'modal active' : 'modal'}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={active ? 'modal__content active' : 'modal__content'}
      >
        <span onClick={handleClose} className='close__button'>
          &times;
        </span>
        {children}
      </div>
    </div>
  );
});
