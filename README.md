# React Native Timer Countdown

A highly customizable countdown component for React Native (iOS and Android).

<p align="center">
  <img src="https://github.com/smarkets/react-native-timer-countdown/blob/master/demo.gif" align="center" width="200px"  />
</p>

## Install

```sh
npm install --save react-native-timer-countdown
```

or

```sh
yarn add react-native-timer-countdown
```

## Usage

```javascript
import React from "react";
import { StyleSheet, View } from "react-native";
import TimerCountdown from "react-native-timer-countdown";

const App = () => (
  <View style={styles.container}>
    <TimerCountdown
      initialSecondsRemaining={1000 * 60}
      onTick={(secondsRemaining) => console.log("tick", secondsRemaining)}
      onComplete={() => console.log("complete")}
      formatSecondsRemaining={(milliseconds) => {
        const remainingSec = Math.round(milliseconds / 1000);
        const seconds = parseInt((remainingSec % 60).toString(), 10);
        const minutes = parseInt(((remainingSec / 60) % 60).toString(), 10);
        const hours = parseInt((remainingSec / 3600).toString(), 10);
        const s = seconds < 10 ? '0' + seconds : seconds;
        const m = minutes < 10 ? '0' + minutes : minutes;
        let h = hours < 10 ? '0' + hours : hours;
        h = h === '00' ? '' : h + ':';
        return h + m + ':' + s;
      }}
      allowFontScaling={true}
      style={{ fontSize: 20 }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default App;
```

## Props

| Name | Description | Type | Required | Default Value |
| :--- | :----- | :--- | :---: | :---: |
| initialSecondsRemaining | The time remaining for the countdown (in ms) | number | ✓ |  |
| formatSecondsRemaining | A function that formats the secondsRemaining | func | | |
| onTick | A function to call each tick. It returns the remaining seconds. | func | | |
| onComplete | A function to call when the countdown completes | func |  | |
| allowFontScaling | to allow font scaling | bool |  | false |
| style | The custom styling which will be applied to the Text component | style |  |  |

## FAQ

### Why does this timer restart whenever I click any button?

#### What's happening

buttons clicked -> state changes -> react rerenders -> timer restarts

#### How to not to restart the timer component

Provided the state changes only occur in component B, A component will not rerender. As a result, no more unintended timer restarts.

```javascript
import React, { Component } from "react";
import { StyleSheet, Button, View } from "react-native";
import TimerCountdown from "react-native-timer-countdown";

const A = () => (
  <View style={styles.container}>
    <B />
    <TimerCountdown initialSecondsRemaining={1000 * 60} />
  </View>
);
export default A;

class B extends Component {
  state = { isPressed: false };
  render() {
    return (
      <View styles={{ flex: 1 }}>
        <Button
          title={`${this.state.isPressed ? "Button Pressed" : "Button"}`}
          onPress={() => {
            this.setState({ isPressed: true });
          }}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
```

## Author

Noel Yoo

## License

MIT
