import { RefObject, memo } from 'react';
import money from './money.png';
import './result.css';

interface ResultType {
  title: string;
  salaryResult?: number;
  color?: string;
  tax?: string;
  picture?: boolean;
  exchange?: boolean;
  pointer?: boolean;
  spanRef?: RefObject<HTMLSpanElement>;

  onClick?: () => void;
}

export const Result = memo((props: ResultType) => {
  const {
    title,
    salaryResult = 0,
    color,
    tax,
    picture,
    exchange,
    pointer,
    spanRef,
    onClick,
  } = props;
  const isNegative = salaryResult < 0;
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
          {tax ? tax : salaryResult.toFixed()}
          {exchange ? ' UAH' : '$'}
        </span>
      </div>
    </div>
  );
});
