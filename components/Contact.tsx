/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Image,
  DeviceEventEmitter,
} from 'react-native';
interface IProps {
  navigation?: any;
  route?: any;
}
interface IState {
  name: string;
  number: string;
  errorMsg: string;
  usersData: any;
  isSave: boolean;
}

export class Contact extends Component<IProps, IState> {
  state = {
    name: '',
    number: '',
    errorMsg: '',
    usersData: {},
    isSave: true,
  };
  onChangeName = (newText: string) => {
    this.setState({name: newText});
  };
  onClickContinue = () => {
    const {name, number, usersData} = this.state;
    const contactsData = {
      id: new Date(),
      name,
      number,
    };
    if (name === '') {
      this.setState({errorMsg: '*Please Enter Name'});
    } else if (number === '') {
      this.setState({errorMsg: '*Please Enter Number'});
    } else if (number.length < 10) {
      this.setState({errorMsg: '*Please Enter 10 digit Number'});
    } else {
      this.setState(
        {
          usersData: contactsData,
          name: '',
          number: '',
        },
        () => {
          this.setData();
        },
      );
    }
  };
  setData = async () => {
    const {usersData} = this.state;
    const pastData: any = await AsyncStorage.getItem('userContact');
    const prevData: any = JSON.parse(pastData);
    console.log(prevData);
    if (prevData === null) {
      await AsyncStorage.setItem('userContact', JSON.stringify([usersData]));
      this.props.navigation.navigate('home', {isFromThird: true});
    } else {
      const newData = [...prevData, usersData];
      await AsyncStorage.setItem('userContact', JSON.stringify(newData));
      this.props.navigation.navigate('home', {isFromThird: true});
    }
  };
  componentDidMount() {
    // this.props.navigation.addListener('focus', this.setEditData);
    this.setEditData();
  }

  setEditData = () => {
    const values = this.props.route.params;
    console.log(values.checkSave);
    if (values.checkSave) {
      this.setState({name: values.name, number: values.number, isSave: false});
    } else {
      this.setState({isSave: true});
    }
  };
  onClickEditContact = async (id: string) => {
    const {name, number} = this.state;
    const editedUser: any = await AsyncStorage.getItem('userContact');
    const editedUserData = JSON.parse(editedUser);
    const filterEditData = editedUserData.map((each: any) => {
      if (each.id === id) {
        return {id, name, number};
      }
      return each;
    });
    await AsyncStorage.setItem('userContact', JSON.stringify(filterEditData));
    this.setState({isSave: true});
    this.props.navigation.navigate('home', {isFromThird: true});
  };
  render() {
    const editId = this.props.route.params.id;
    const headName = this.state.isSave ? 'Add' : 'Edit';
    return (
      <SafeAreaView style={styles.mainComponent}>
        <View style={styles.backGroundImg}>
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>{headName} Contact</Text>
            <View style={styles.inputCardContainer}>
              <TextInput
                value={this.state.name}
                style={styles.inputText}
                placeholder="Name"
                onChangeText={this.onChangeName}
              />
              <TextInput
                value={this.state.number}
                style={styles.inputText}
                placeholder="Number"
                maxLength={10}
                keyboardType="numeric"
                onChangeText={(newText: string) => {
                  this.setState({number: newText});
                }}
              />
              <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
              {this.state.isSave ? (
                <TouchableOpacity
                  style={styles.continueBtn}
                  onPress={this.onClickContinue}>
                  <Text style={styles.saveText}>Save Contact</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.continueBtn}
                  onPress={() => {
                    this.onClickEditContact(editId);
                  }}>
                  <Text style={styles.saveText}>Edit Contact</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainComponent: {
    flex: 1,
    backgroundColor: '#000',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backGroundImg: {
    flex: 1,
    padding: 20,
  },
  loginText: {
    fontSize: 32,
    fontWeight: '400',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputCardContainer: {
    height: 400,
    width: 330,
    borderRadius: 12,
    backgroundColor: '#d7c3e0',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputText: {
    backgroundColor: '#EAF4F4',
    width: 300,
    height: 48,
    borderRadius: 8,
    marginBottom: 10,
    paddingLeft: 10,
  },
  continueBtn: {
    backgroundColor: '#1036e0',
    width: 300,
    height: 48,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 20,
  },
  errorMsg: {
    color: 'red',
  },
});
export default Contact;
