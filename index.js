'use strict';
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result['default'] = mod;
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
const React = __importStar(require('react'));
const react_native_1 = require('react-native');
class TimerCountdown extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      secondsRemaining: this.props.initialSecondsRemaining,
      timeoutId: undefined,
      previousSeconds: undefined
    };
    this.tick = () => {
      const currentSeconds = Date.now();
      const dt = this.state.previousSeconds ? currentSeconds - this.state.previousSeconds : 0;
      const interval = 1000;
      const intervalSecondsRemaing = interval - (dt % interval);
      let timeout = intervalSecondsRemaing;
      if (intervalSecondsRemaing < interval / 2.0) {
        timeout += interval;
      }
      const secondsRemaining = Math.max(this.state.secondsRemaining - dt, 0);
      const isComplete = !!this.state.previousSeconds && secondsRemaining <= 0;
      if (this.state.timeoutId !== undefined) {
        clearTimeout(this.state.timeoutId);
      }
      this.setState({
        timeoutId: isComplete ? undefined : setTimeout(this.tick, timeout),
        previousSeconds: currentSeconds,
        secondsRemaining
      });
      if (isComplete) {
        if (this.props.onComplete) {
          this.props.onComplete();
        }
        return;
      }
      if (this.props.onTick !== undefined) {
        this.props.onTick(secondsRemaining);
      }
    };
    this.getFormattedTime = milliseconds => {
      if (this.props.formatSecondsRemaining !== undefined) {
        return this.props.formatSecondsRemaining(milliseconds);
      }
      const remainingSec = Math.round(milliseconds / 1000);
      const seconds = parseInt((remainingSec % 60).toString(), 10);
      const minutes = parseInt(((remainingSec / 60) % 60).toString(), 10);
      const hours = parseInt((remainingSec / 3600).toString(), 10);
      const s = seconds < 10 ? '0' + seconds : seconds;
      const m = minutes < 10 ? '0' + minutes : minutes;
      let h = hours < 10 ? '0' + hours : hours;
      h = h === '00' ? '' : h + ':';
      return h + m + ':' + s;
    };
  }
  componentDidMount() {
    this.tick();
  }
  componentWillReceiveProps(newProps) {
    if (this.state.timeoutId !== undefined) {
      clearTimeout(this.state.timeoutId);
    }
    this.setState({
      previousSeconds: undefined,
      secondsRemaining: newProps.initialSecondsRemaining
    });
  }
  componentDidUpdate() {
    if (!this.state.previousSeconds && this.state.secondsRemaining > 0) {
      this.tick();
    }
  }
  componentWillUnmount() {
    clearTimeout(this.state.timeoutId);
  }
  render() {
    const secondsRemaining = this.state.secondsRemaining;
    const allowFontScaling = !!this.props.allowFontScaling;
    const style = this.props.style;
    return (
      <react_native_1.Text allowFontScaling={allowFontScaling} style={style}>
        {this.getFormattedTime(secondsRemaining)}
      </react_native_1.Text>
    );
  }
}
TimerCountdown.defaultProps = {
  formatSecondsRemaining: undefined,
  onTick: undefined,
  onComplete: undefined
};
exports.default = TimerCountdown;
