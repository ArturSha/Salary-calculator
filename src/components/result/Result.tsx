import { RefObject } from 'react';
import money from './money.png';
import './result.css';

interface ResultType {
  title: string;
  isNightShift?: boolean;
  daySalary?: number;
  nightSalary?: number;
  color?: string;
  tax?: string;
  picture?: boolean;
  exchange?: boolean;
  pointer?: boolean;
  spanRef?: RefObject<HTMLSpanElement>;

  onClick?: () => void;
}

export const Result: React.FC<ResultType> = ({
  title,
  isNightShift,
  daySalary = 0,
  nightSalary = 0,
  color,
  tax,
  picture,
  exchange,
  pointer,
  spanRef,
  onClick,
}) => {
  const isNegative = daySalary < 0 || nightSalary < 0;
  return (
    <div
      className={`group-result ${pointer ? 'pointer' : null}`}
      onClick={onClick}
    >
      <div>
        <span>
          {title}
          <span
            className='group-result-circle'
            style={{ backgroundColor: `${color}` }}
          >
            {picture ? (
              <img className='img-money' src={money} alt='money' />
            ) : null}
          </span>
        </span>
      </div>
      <div>
        <span
          ref={spanRef}
          className={`${isNegative ? 'negative' : 'positive'}`}
        >
          {tax
            ? tax
            : isNightShift
            ? nightSalary.toFixed()
            : daySalary.toFixed()}
          {exchange ? ' UAH' : '$'}
        </span>
      </div>
    </div>
  );
};
