import { getStopwatchElapsedSeconds, splitDuration } from '@clockboard/shared/timers'

export default function Stopwatch({ stopwatch, showControls, onClose, onReset, onToggle }) {
  const { hoursStr, minutesStr, secondsStr } = splitDuration(getStopwatchElapsedSeconds(stopwatch))

  return (
    <div className="timer">
      <div className="timerValues">
        <div className="timeSection timerHour">{hoursStr}</div>
        <div className="timeSection timerMinute">{minutesStr}</div>
        <div className="timeSection timerSecond">{secondsStr}</div>
      </div>
      <div className="timerLabel">{stopwatch.label}</div>
      <div className={`buttons${showControls ? ' show' : ''}`}>
        <i className="fas fa-undo-alt actionIcon" onClick={onReset}></i>
        <i className="far fa-window-close actionIcon" onClick={onClose}></i>
        <i className={`fas ${stopwatch.paused ? 'fa-play' : 'fa-pause'} actionIcon`} onClick={onToggle}></i>
      </div>
    </div>
  )
}
