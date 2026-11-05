import { getTimerSecondsLeft, splitDuration } from '@clockboard/shared/timers'

export default function Timer({ timer, tick, showControls, onClose, onReset, onToggle }) {
  const diffInSeconds = getTimerSecondsLeft(timer)
  const expired = diffInSeconds < 0
  const { hoursStr, minutesStr, secondsStr } = splitDuration(diffInSeconds)

  return (
    <div className="timer">
      <div className={`timerValues ${expired ? ' timerComplete' : ''}`}>
        <div className="timeSection timerHour">{hoursStr}</div>
        <div className="timeSection timerMinute">{minutesStr}</div>
        <div className="timeSection timerSecond">{secondsStr}</div>
      </div>
      <div className="timerLabel">{timer.label}</div>
      <div className={`buttons${showControls ? ' show' : ''}`}>
        <i className="fas fa-undo-alt actionIcon" onClick={onReset}></i>
        <i className="far fa-window-close actionIcon" onClick={onClose}></i>
        <i className={`fas ${timer.paused ? 'fa-play' : 'fa-pause'} actionIcon`} onClick={onToggle}></i>
      </div>
    </div>
  )
}
