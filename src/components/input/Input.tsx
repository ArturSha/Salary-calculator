import { useEffect, useRef } from 'react';
import './input.css';

interface InputType {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step?: string;
  label: string;
  type: string;
}

export const Input: React.FC<InputType> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (inputRef.current && inputRef.current.contains(event.target as Node)) {
        event.preventDefault();
        const inputStep = parseFloat(props.step || '1');
        if (event.deltaY > 0) {
          props.onChange({
            target: { value: (parseFloat(props.value) - inputStep).toString() },
          } as React.ChangeEvent<HTMLInputElement>);
        } else if (event.deltaY < 0) {
          props.onChange({
            target: { value: (parseFloat(props.value) + inputStep).toString() },
          } as React.ChangeEvent<HTMLInputElement>);
        }
      }
    };

    if (inputRef.current) {
      inputRef.current.addEventListener('wheel', handleWheel, {
        passive: false,
      });
    }

    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener('wheel', handleWheel);
      }
    };
  }, [props]);

  return (
    <div className='input-container'>
      <label>
        {props.label}
        <input
          className='input'
          type={props.type}
          step={props.step}
          value={props.value}
          onChange={props.onChange}
          ref={inputRef}
        />
      </label>
    </div>
  );
};
