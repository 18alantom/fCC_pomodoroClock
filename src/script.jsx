import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import soundFile from './bell.mp3';
import './styles/styles.scss';

const root = document.querySelector('.root');

function secondsToExpression(s) {
  let minutes;
  let seconds;
  let exp = '';
  if (s >= 0 && s < 60) {
    seconds = s;
    minutes = 0;
  } else if (s >= 60) {
    seconds = s % 60;
    minutes = Math.floor(s / 60);
  }
  exp = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  return exp;
}

// ______________________
// React Components Below
// ______________________
class PomodoroController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionTime: 25,
      breakTime: 5,
      isSession: true,
      secondsLeft: 0,
    };
    this.interval = 0;
    this.setBeepSound = this.setBeepSound.bind(this);
    this.startStopButtonHandler = this.startStopButtonHandler.bind(this);
    this.timeChangeHandler = this.timeChangeHandler.bind(this);
    this.resetButtonHandler = this.resetButtonHandler.bind(this);
    this.decreaseSession = this.decreaseSession.bind(this);
    this.increaseSession = this.increaseSession.bind(this);
    this.decreaseBreak = this.decreaseBreak.bind(this);
    this.increaseBreak = this.increaseBreak.bind(this);
  }
  componentWillMount() {
    const { sessionTime, breakTime, isSession } = this.state;
    const secondsLeft = (isSession ? sessionTime : breakTime) * 60;
    this.setState({
      secondsLeft,
    });
  }
  setBeepSound(e) {
    this.beepSound = e;
  }
  startStopButtonHandler() {
    const { secondsLeft, isSession } = this.state;
    const sT = this.state.sessionTime * 60;
    const bT = this.state.breakTime * 60;
    let t = secondsLeft;
    if (secondsLeft === sT || secondsLeft === bT || secondsLeft === 0) {
      t = isSession ? sT : bT;
    }
    this.setState({
      secondsLeft: t,
    });
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    } else if (!this.interval) {
      this.interval = setInterval(() => {
        this.setState(prevState => ({ secondsLeft: prevState.secondsLeft - 1 }));
        if (this.state.secondsLeft === 0) {
          this.beepSound.play();
          clearInterval(this.interval);
          this.interval = null;
          setTimeout(() => {
            this.setState(prevState => ({
              isSession: !prevState.isSession,
            }));
            this.startStopButtonHandler();
          }, 1000);
        }
      }, 1000);
    }
  }
  decreaseSession() {
    this.setState((prevState) => {
      const t = prevState.sessionTime === 1 ? 1 : prevState.sessionTime - 1;
      return {
        sessionTime: t,
        secondsLeft: t * 60,
      };
    });
  }

  increaseSession() {
    this.setState((prevState) => {
      const t = prevState.sessionTime === 60 ? 60 : prevState.sessionTime + 1;
      return {
        sessionTime: t,
        secondsLeft: t * 60,
      };
    });
  }

  decreaseBreak() {
    this.setState((prevState) => {
      const t = prevState.breakTime === 1 ? 1 : prevState.breakTime - 1;
      return {
        breakTime: t,
      };
    });
  }

  increaseBreak() {
    this.setState((prevState) => {
      const t = prevState.breakTime === 60 ? 60 : prevState.breakTime + 1;
      return {
        breakTime: t,
      };
    });
  }

  timeChangeHandler(e) {
    // console.log(e.target.parentElement.parentElement);
    const b = e.target.parentElement.parentElement.classList.contains('break-controls');
    const s = e.target.parentElement.parentElement.classList.contains('session-controls');
    if (b) {
      let t = this.state.breakTime;
      if (e.target.parentElement.id === 'break-decrement') {
        t = t === 1 ? t : t - 1;
      } else if (e.target.parentElement.id === 'break-increment') {
        t = t === 60 ? t : t + 1;
      }
      this.setState({
        breakTime: t,
      });
    } else if (s) {
      let t = this.state.sessionTime;
      if (e.target.parentElement.id === 'session-decrement') {
        t = t === 1 ? t : t - 1;
      } else if (e.target.parentElement.id === 'session-increment') {
        t = t === 60 ? t : t + 1;
      }
      this.setState({
        sessionTime: t,
        secondsLeft: t * 60,
      });
    }
  }
  resetButtonHandler() {
    // stop();
    this.beepSound.pause();
    this.beepSound.currentTime = 0;
    const breakTime = 5;
    const sessionTime = 25;
    const secondsLeft = 25 * 60;
    const isSession = true;
    clearInterval(this.interval);
    this.interval = null;
    this.setState({
      breakTime,
      sessionTime,
      isSession,
      secondsLeft,
    });
  }
  render() {
    const {
      sessionTime, breakTime, isSession, secondsLeft,
    } = this.state;
    return (
      <Pomodoro
        resetButtonHandler={this.resetButtonHandler}
        startStopButtonHandler={this.startStopButtonHandler}
        increaseSession={this.increaseSession}
        decreaseSession={this.decreaseSession}
        increaseBreak={this.increaseBreak}
        decreaseBreak={this.decreaseBreak}
        setBeepSound={this.setBeepSound}
        interval={Number(this.interval)}
        secondsLeft={secondsLeft}
        sessionTime={sessionTime}
        breakTime={breakTime}
        isSession={isSession}
      />
    );
  }
}

function Pomodoro(props) {
  const down = <i className="fa fa-angle-down" data-t="down" />;
  const up = <i className="fa fa-angle-up" data-t="up" />;
  const play = <i className="fa fa-play" />;
  const pause = <i className="fa fa-pause" />;
  const stop = <i className="fa fa-stop" />;
  let addClassContainer = '';
  let addClassTimer = '';
  let addClassTitle = '';
  if (props.interval) {
    addClassContainer = props.isSession ? 'timerSessionContainer' : 'timerRestContainer';
    addClassTimer = props.isSession ? 'timerSessionTimer' : 'timerRestTimer';
    addClassTitle = props.isSession ? 'timerSessionTitle' : 'timerRestTitle';
  }
  return (
    <div id="container-div" className={addClassContainer}>
      <h1 className={addClassTitle}>Pomodoro Timer</h1>

      <div id="inner-container-div">
        <div id="time-div">
          <p id="time-left" className={addClassTimer}>
            {secondsToExpression(props.secondsLeft)}
          </p>
          <p id="timer-label">{props.isSession ? 'Session' : 'Break'}</p>
        </div>

        <div id="controls-div">
          <button id="start_stop" onClick={props.startStopButtonHandler}>
            {props.interval ? pause : play}
          </button>
          <button id="reset" onClick={props.resetButtonHandler}>
            {stop}
          </button>
        </div>

        <div id="setter-div" className={props.interval ? 'timerControls' : ''}>
          <div className="break-controls controls">
            <p id="break-label">
              Break <span id="break-length">{props.breakTime}</span>
            </p>

            <button id="break-decrement" onClick={props.decreaseBreak}>
              {down}
            </button>
            <button id="break-increment" onClick={props.increaseBreak}>
              {up}
            </button>
          </div>

          <div className="session-controls controls">
            <p id="session-label">
              Session <span id="session-length">{props.sessionTime}</span>
            </p>
            <button id="session-decrement" onClick={props.decreaseSession}>
              {down}
            </button>
            <button id="session-increment" onClick={props.increaseSession}>
              {up}
            </button>
          </div>
        </div>
      </div>

      <audio src={soundFile} type="audio/mpeg" id="beep" preload="auto" ref={props.setBeepSound}>
        <track src={soundFile} kind="captions" />
      </audio>
    </div>
  );
}

ReactDOM.render(<PomodoroController />, root);

Pomodoro.propTypes = {
  setBeepSound: PropTypes.func.isRequired,
  startStopButtonHandler: PropTypes.func.isRequired,
  // timeChangeHandler: PropTypes.func.isRequired,
  increaseBreak: PropTypes.func.isRequired,
  decreaseBreak: PropTypes.func.isRequired,
  increaseSession: PropTypes.func.isRequired,
  decreaseSession: PropTypes.func.isRequired,
  resetButtonHandler: PropTypes.func.isRequired,
  sessionTime: PropTypes.number.isRequired,
  breakTime: PropTypes.number.isRequired,
  secondsLeft: PropTypes.number.isRequired,
  isSession: PropTypes.bool.isRequired,
  interval: PropTypes.number.isRequired,
};
