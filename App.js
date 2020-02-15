import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LogInSignUp from './Components/LogInSignUp'
import SplashScreen from './Components/SplashScreen'
import Home from './Components/Home'
import * as firebase from 'firebase'
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';


export default class App extends Component {

  state = {
    loading : true,
    authenticated : false,
    user : ''
  }

  // async componentWillMount() {
  //   await Font.loadAsync({
  //     Roboto: require("native-base/Fonts/Roboto.ttf"),
  //     Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
  //   });
  //   this.setState({ loading: false });
  // }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    // this.setState({ isReady: true });
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ loading: false, authenticated: true, user : user.email });
        console.log("the state", this.state)
      } else {
        this.setState({ loading: false, authenticated: false });
      }
    });
  }

  render(){
    
      if (this.state.loading) {
        return <AppLoading />;
      }
         ; // Render loading/splash screen etc

      if (!this.state.authenticated) {
        return <LogInSignUp />;
      }
      else{
        return <Home user = {this.state.user}/>;
      }
     
  
  }

}


