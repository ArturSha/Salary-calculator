import { memo, useEffect, useRef } from 'react';
import './input.css';

interface InputType {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step?: string;
  label: string;
  type: string;
  min?: string;
  modal?: boolean;
  modalClassName?: string;
  modalSrc?: string;
  modalAlt?: string;
  modalOnClick?: () => void;
}

export const Input = memo((props: InputType) => {
  const {
    label,
    onChange,
    type,
    value,
    min,
    modal,
    onBlur,
    step,
    modalClassName,
    modalOnClick,
    modalSrc,
    modalAlt,
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const currentRed = inputRef.current;
    const handleWheel = (event: WheelEvent) => {
      if (currentRed && currentRed.contains(event.target as Node)) {
        event.preventDefault();
        const inputStep = parseFloat(step || '1');
        const currentValue = parseFloat(value) || 0;
        if (event.deltaY > 0) {
          onChange({
            target: { value: (currentValue - inputStep).toString() },
          } as React.ChangeEvent<HTMLInputElement>);
        } else if (event.deltaY < 0) {
          onChange({
            target: { value: (currentValue + inputStep).toString() },
          } as React.ChangeEvent<HTMLInputElement>);
        }
      }
    };

    if (currentRed) {
      currentRed.addEventListener('wheel', handleWheel, {
        passive: false,
      });
    }

    return () => {
      if (currentRed) {
        currentRed.removeEventListener('wheel', handleWheel);
      }
    };
  }, [onChange, step, value]);

  return (
    <div className='input-container'>
      <label>
        {label}
        <input
          min={min}
          className='input'
          type={type}
          step={step}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          ref={inputRef}
        />
        {modal && (
          <img
            src={modalSrc}
            alt={modalAlt}
            className={modalClassName}
            onClick={modalOnClick}
          />
        )}
      </label>
    </div>
  );
});
