import React, { Component } from 'react';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Text,  Tab, Tabs, ScrollableTab } from 'native-base';
// import * as firebase from 'firebase'
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import * as firebase from 'firebase'

import Tasks from './Tasks'

var firebaseConfig = {
    apiKey: "AIzaSyAjTNdAehMLq9W5QRD9xUjtnSAiOj4bdRU",
    authDomain: "todo-react-native-afb3a.firebaseapp.com",
    databaseURL: "https://todo-react-native-afb3a.firebaseio.com",
    projectId: "todo-react-native-afb3a",
    storageBucket: "todo-react-native-afb3a.appspot.com",
    messagingSenderId: "521891704896",
    appId: "1:521891704896:web:38bd456b6a16e5cb71efa5"
  };
  // Initialize Firebase
  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }


export default class Home extends Component {

    state = {
        user : '',
        isReady : false,
        loggedIn : false,
    }

    async componentDidMount() {
        await Font.loadAsync({
            Roboto: require('native-base/Fonts/Roboto.ttf'),
            Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
            ...Ionicons.font,
          });
          this.setState({ isReady: true });

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
            // this.setState({ loading: false, authenticated: true, user : user.email });
            console.log("the user at home", user.email)
            this.setState({user : user.email, loggedIn : true})
            } 
            else {
                console.log("error")
            // this.setState({ loading: false, authenticated: false });
            }
        });
    }


  render() {
      
    if (!this.state.isReady) {
        return <AppLoading />;
    }

    return (
        <Container style={{flex:1, }}>
        <Header>
          <Body>
            <Title>{this.state.user.substring(0,this.state.user.indexOf('@'))}'s Notes</Title>
          </Body>
          <Right>
            <Button transparent
                onPress={() => firebase.auth().signOut()} 
            >
              <Text>Logout</Text>
            </Button>
          </Right>
        </Header>
        <Tabs renderTabBar={()=> <ScrollableTab />}>
          <Tab heading="Tasks">
            <Tasks loggedInUser = {this.state.user} />
          </Tab>
          <Tab heading="Notes">
            <Text>Hello</Text>
          </Tab>
          
  
        </Tabs>
      </Container>
    );
  }
}