import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './styles/styles.scss';

class PomodoroController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionTime: 25,
      breakTime: 5,
    };
    this.timeChangeHandler = this.timeChangeHandler.bind(this);
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
      });
    }
    console.log(this.state);
  }
  render() {
    return (
      <Pomodoro
        timeChangeHandler={this.timeChangeHandler}
        sessionTime={this.state.sessionTime}
        breakTime={this.state.breakTime}
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
        <h2 id="timer-label">Session</h2>
        <h3 id="time-left">25:00</h3>
      </div>
      <div id="controls-div">
        <button id="start_stop">ST</button>
        <button id="reset">RESET</button>
      </div>
    </div>
  );
}

ReactDOM.render(<PomodoroController />, document.querySelector('.root'));

Pomodoro.propTypes = {
  timeChangeHandler: PropTypes.func.isRequired,
  sessionTime: PropTypes.number.isRequired,
  breakTime: PropTypes.number.isRequired,
};
