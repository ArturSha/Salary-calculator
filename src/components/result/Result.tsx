import './result.css';

interface ResultType {
  title: string;
  isNightShift?: boolean;
  daySalary?: number;
  nightSalary?: number;
  color?: string;
  tax?: string;
}

export const Result: React.FC<ResultType> = ({
  title,
  isNightShift,
  daySalary = 0,
  nightSalary = 0,
  color,
  tax,
}) => {
  const isNegative = daySalary < 0 || nightSalary < 0;
  return (
    <div className='group-result'>
      <div>
        <span>
          {title}
          <span
            className='group-result-circle'
            style={{ backgroundColor: `${color}` }}
          ></span>
        </span>
      </div>
      <div>
        <span className={`${isNegative ? 'negative' : 'positive'}`}>
          {tax
            ? tax
            : isNightShift
            ? nightSalary.toFixed()
            : daySalary.toFixed()}
          $
        </span>
      </div>
    </div>
  );
};
