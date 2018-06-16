import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './styles/styles.scss';

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
      interval: 0,
      isIntervalRunning: false,
    };
    this.startStopButtonHandler = this.startStopButtonHandler.bind(this);
    this.timeChangeHandler = this.timeChangeHandler.bind(this);
    this.timeUpdater = this.timeUpdater.bind(this);
    this.resetButtonHandler = this.resetButtonHandler.bind(this);
  }
  componentWillMount() {
    const secondsLeft = this.state.sessionTime * 60;
    this.setState({
      secondsLeft,
    });
  }

  timeUpdater(t) {
    const isS = this.state.isSession;
    // const secL = this.state.secondsLeft;
    let seconds = t;
    // console.log(`from:timeUpdater t${t} isSession${isS} secondsLeft${secL}`);
    this.setState({
      isIntervalRunning: true,
      interval: setInterval(() => {
        seconds -= 1;
        // console.log(`from:timeUpdater,intervalfunctionj;seconds${seconds}`);
        this.setState({
          secondsLeft: seconds,
        });
        if (seconds === 0) {
          clearInterval(this.state.interval);
          this.setState({ isSession: !isS, isIntervalRunning: false });
          this.startStopButtonHandler();
        }
      }, 1000),
    });
  }

  startStopButtonHandler() {
    const { secondsLeft, isIntervalRunning, isSession } = this.state;
    const sT = this.state.sessionTime * 60;
    const bT = this.state.breakTime * 60;
    const t = isSession ? sT : bT;
    // console.log(`from:startStopButtonHandler t${t} secondsLeft${secondsLeft}`);
    if (isIntervalRunning) {
      clearInterval(this.state.interval);
      this.setState({
        isIntervalRunning: false,
        secondsLeft,
      });
    } else if (!isIntervalRunning) {
      if (secondsLeft !== 0) {
        this.timeUpdater(secondsLeft);
      } else if (secondsLeft === 0) {
        this.timeUpdater(t);
      }
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
    const { interval, isIntervalRunning } = this.state;
    const breakTime = 5;
    const sessionTime = 25;
    const secondsLeft = 25 * 60;
    const isSession = true;
    if (isIntervalRunning) {
      clearInterval(interval);
      this.setState({
        isIntervalRunning: false,
      });
    }
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
        sessionTime={sessionTime}
        breakTime={breakTime}
        isSession={isSession}
        secondsLeft={secondsLeft}
      />
    );
  }
}

function Pomodoro(props) {
  return (
    <div id="container-div" style={{ background: 'skyblue', textAlign: 'center' }}>
      <div id="setter-div">
        <div className="break-controls">
          <h4 id="break-label">Break Length: {props.breakTime}</h4>
          <button id="break-decrement" onClick={props.timeChangeHandler}>
            Down
          </button>
          <button id="break-increment" onClick={props.timeChangeHandler}>
            Up
          </button>
        </div>

        <div className="session-controls">
          <h4 id="session-label">Session Length: {props.sessionTime}</h4>
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
    </div>
  );
}

ReactDOM.render(<PomodoroController />, document.querySelector('.root'));

Pomodoro.propTypes = {
  startStopButtonHandler: PropTypes.func.isRequired,
  timeChangeHandler: PropTypes.func.isRequired,
  resetButtonHandler: PropTypes.func.isRequired,
  sessionTime: PropTypes.number.isRequired,
  breakTime: PropTypes.number.isRequired,
  secondsLeft: PropTypes.number.isRequired,
  isSession: PropTypes.bool.isRequired,
};
