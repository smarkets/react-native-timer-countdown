// tslint:disable-next-line: no-implicit-dependencies
import * as React from 'react';
// tslint:disable-next-line: no-implicit-dependencies
import { Text } from 'react-native';

interface ITimerCountdownProps {
  initialSecondsRemaining: number;
  formatSecondsRemaining?: (milliseconds: number) => string;
  onTick?: (secondsRemaining: number) => void;
  onComplete?: () => void;
  allowFontScaling?: boolean;
  style?: object;
}

export default class TimerCountdown extends React.Component<ITimerCountdownProps> {
  public readonly state = {
    secondsRemaining: this.props.initialSecondsRemaining,
    timeoutId: undefined,
    previousSeconds: undefined
  };

  public componentDidMount(): void {
    this.tick();
  }

  public componentWillReceiveProps(newProps): void {
    if (this.state.timeoutId !== undefined) {
      clearTimeout(this.state.timeoutId);
    }
    this.setState({
      previousSeconds: undefined,
      secondsRemaining: newProps.initialSecondsRemaining
    });
  }

  public componentDidUpdate(): void {
    if (!this.state.previousSeconds && this.state.secondsRemaining > 0) {
      this.tick();
    }
  }

  public componentWillUnmount(): void {
    clearTimeout(this.state.timeoutId);
  }

  private tick = () => {
    const currentSeconds = Date.now();
    const dt = this.state.previousSeconds ? currentSeconds - this.state.previousSeconds : 0;
    const interval: number = 1000;

    // correct for small variations in actual timeout time
    const intervalSecondsRemaing: number = interval - (dt % interval);
    let timeout: number = intervalSecondsRemaing;

    if (intervalSecondsRemaing < interval / 2.0) {
      timeout += interval;
    }

    const secondsRemaining: number = Math.max(this.state.secondsRemaining - dt, 0);
    const isComplete: boolean = this.state.previousSeconds && secondsRemaining <= 0;

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

  private getFormattedTime = (milliseconds: number): string => {
    if (this.props.formatSecondsRemaining !== undefined) {
      return this.props.formatSecondsRemaining(milliseconds);
    }
    const remainingSec: number = Math.round(milliseconds / 1000);

    const seconds: number = parseInt((remainingSec % 60).toString(), 10);
    const minutes: number = parseInt(((remainingSec / 60) % 60).toString(), 10);
    const hours: number = parseInt((remainingSec / 3600).toString(), 10);

    const s = seconds < 10 ? '0' + seconds : seconds;
    const m = minutes < 10 ? '0' + minutes : minutes;
    let h = hours < 10 ? '0' + hours : hours;
    h = h === '00' ? '' : h + ':';
    return h + m + ':' + s;
  };

  public render(): React.ReactNode {
    const secondsRemaining: number = this.state.secondsRemaining;
    const allowFontScaling: boolean = this.props.allowFontScaling;
    const style = this.props.style;
    return (
      <Text allowFontScaling={allowFontScaling} style={style}>
        {this.getFormattedTime(secondsRemaining)}
      </Text>
    );
  }

  public static defaultProps = {
    formatSecondsRemaining: undefined,
    onTick: undefined,
    onComplete: undefined
  };
}
