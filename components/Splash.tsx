import {StyleSheet, Text, View} from 'react-native';
import React, {Component} from 'react';
interface IProps {
  navigation?: any;
}
export class Splash extends Component<IProps> {
  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.navigate('home');
    }, 2000);
  }
  render() {
    return (
      <View style={styles.mainSplashComntainer}>
        <Text style={styles.splashText}>Splash</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  mainSplashComntainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  splashText: {
    fontSize: 25,
    color: '#fff',
    fontWeight: '600',
  },
});
export default Splash;
