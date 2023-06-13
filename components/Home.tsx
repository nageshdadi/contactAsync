/* eslint-disable @typescript-eslint/no-unused-vars */
import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

interface IProps {
  navigation?: any;
  route?: any;
}
interface IState {
  contactData: any[];
}
export class Home extends Component<IProps, IState> {
  state = {
    contactData: [],
  };
  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const data: any = await AsyncStorage.getItem('userContact');
    this.setState({contactData: JSON.parse(data)});
  };
  componentDidUpdate() {
    let isFromThird = this.props.route.params?.isFromThird ?? false;
    if (isFromThird) {
      this.getData();
    }
  }
  onPressDelete = async (id: string) => {
    const {contactData} = this.state;
    const filteredData = contactData.filter((each: any) => each.id !== id);
    // console.log(filteredData);
    this.setState({contactData: filteredData}, async () => {
      await AsyncStorage.setItem('userContact', JSON.stringify(filteredData));
    });
  };
  onPressEdit = (id: string) => {
    const {contactData} = this.state;
    const filteredEditData: any = contactData.filter(
      (each: any) => each.id === id,
    );
    this.props.navigation.navigate('contact', {
      ...filteredEditData[0],
      checkSave: true,
    });
  };
  render() {
    const {contactData} = this.state;

    return (
      <View style={styles.mainHomeContainer}>
        <TouchableOpacity
          style={styles.addContactBtn}
          onPress={() => {
            this.props.navigation.navigate('contact', {
              id: '',
              name: '',
              number: '',
              checkSave: false,
            });
          }}>
          <Icon name="pluscircleo" size={30} />
          <Text style={styles.addContactText}>Add Contact</Text>
        </TouchableOpacity>
        <Text style={styles.contactsText}>Contacts</Text>
        <FlatList
          data={contactData}
          renderItem={({item}: {item: any}) => (
            <View style={styles.contactsCard}>
              <View style={styles.contactIconCrad}>
                <Icon name="user" size={35} />
                <View style={styles.cardPerson}>
                  <Text style={styles.TextName}>{item.name}</Text>
                  <Text>{item.number}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.onPressEdit(item.id);
                }}>
                <Icon name="edit" size={30} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.onPressDelete(item.id);
                }}>
                <Icon name="delete" size={30} />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainHomeContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: '#0b0d0a',
  },
  contactsText: {
    fontSize: 30,
    marginTop: 10,
    marginBottom: 10,
    color: '#fff',
  },
  addContactBtn: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 10,
    borderRadius: 10,
    backgroundColor: '#d5d9d2',
    width: 180,
    height: 50,
    alignSelf: 'center',
  },
  addContactText: {
    fontSize: 18,
    marginLeft: 10,
  },
  contactsCard: {
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactIconCrad: {
    flexDirection: 'row',
  },
  cardPerson: {
    marginLeft: 10,
  },
  TextName: {
    fontSize: 20,
    fontWeight: '400',
    color: '#000',
  },
  deleteBtn: {
    backgroundColor: '#b8622c',
    padding: 7,
    borderRadius: 5,
  },
});
export default Home;
