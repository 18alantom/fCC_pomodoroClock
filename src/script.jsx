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
  timeChangeHandler(e) {
    const b = e.target.parentElement.classList.contains('break-controls');
    const s = e.target.parentElement.classList.contains('session-controls');
    if (b) {
      let t = this.state.breakTime;
      if (e.target.id === 'break-decrement') {
        t = t === 1 ? t : t - 1;
      } else if (e.target.id === 'break-increment') {
        t = t === 60 ? t : t + 1;
      }
      this.setState({
        breakTime: t,
      });
    } else if (s) {
      let t = this.state.sessionTime;
      if (e.target.id === 'session-decrement') {
        t = t === 1 ? t : t - 1;
      } else if (e.target.id === 'session-increment') {
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
        startStopButtonHandler={this.startStopButtonHandler}
        resetButtonHandler={this.resetButtonHandler}
        timeChangeHandler={this.timeChangeHandler}
        setBeepSound={this.setBeepSound}
        secondsLeft={secondsLeft}
        sessionTime={sessionTime}
        breakTime={breakTime}
        isSession={isSession}
      />
    );
  }
}

function Pomodoro(props) {
  return (
    <div id="container-div" style={{ background: 'skyblue', textAlign: 'center' }}>
      <div id="setter-div">
        <div className="break-controls">
          <h4 id="break-label">
            Break Length: <span id="break-length">{props.breakTime}</span>
          </h4>
          <button id="break-decrement" onClick={props.timeChangeHandler}>
            Down
          </button>
          <button id="break-increment" onClick={props.timeChangeHandler}>
            Up
          </button>
        </div>

        <div className="session-controls">
          <h4 id="session-label">
            Session Length: <span id="session-length">{props.sessionTime}</span>
          </h4>
          <button id="session-decrement" onClick={props.timeChangeHandler}>
            Down
          </button>
          <button id="session-increment" onClick={props.timeChangeHandler}>
            Up
          </button>
        </div>
      </div>
      <div id="time-div">
        <h2 id="timer-label">{props.isSession ? 'Session' : 'Break'}</h2>
        <h3 id="time-left">{secondsToExpression(props.secondsLeft)}</h3>
      </div>
      <div id="controls-div">
        <button id="start_stop" onClick={props.startStopButtonHandler}>
          ST
        </button>
        <button id="reset" onClick={props.resetButtonHandler}>
          RESET
        </button>
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
  timeChangeHandler: PropTypes.func.isRequired,
  resetButtonHandler: PropTypes.func.isRequired,
  sessionTime: PropTypes.number.isRequired,
  breakTime: PropTypes.number.isRequired,
  secondsLeft: PropTypes.number.isRequired,
  isSession: PropTypes.bool.isRequired,
};
