import './toggleSwitch.css';

interface ToggleSwitchType {
  onClick: any;
  onChange: any;
  checked: boolean;
  on: string;
  off: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchType> = (props) => {
  return (
    <div className='mid'>
      <label className='rocker' onClick={props.onClick}>
        <input
          type='checkbox'
          checked={props.checked}
          onChange={props.onChange}
        />
        <span className='switch-left'>{props.on}</span>
        <span className='switch-right'>{props.off}</span>
      </label>
    </div>
  );
};
