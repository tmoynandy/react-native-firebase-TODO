import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as firebase from 'firebase'
// import * as Facebook from 'expo-facebook'; 
import {Container, Content, Header, Form, Input, Item, Button,  Label, Card, CardItem, Body, Toast} from 'native-base'

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

export default class LogInSignUp extends Component {

  state = {
    email : '',
    password : ''
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged( user =>{
      if(user !== null){
        console.log(user.email)
      }
    })
  }

  signUpUser = ( email, password) =>{
    try{
      if( this.state.password.length < 6){
        alert(" Please Enter min. 6 Character Password")
        return;
      }
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then( data=>{
          console.log(data.user.email)
          alert(" Signup success ")
        })
    }
    catch(error){
      console.log(error.toString())
    }
  }

  loginUser = ( email, password) =>{
    try{
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then( data=>{
          console.log(data.user.email)
        //   alert(" Login success ")
        })
    }
    catch( error){
      console.log(error.toString())
    }
  }

  // async loginWithFacebook(){
  //   const {type, token} = await Facebook.logInWithReadPermissionsAsync(
  //     '178395636776519', {permissions : ['public_profile']})

  //     if( type == 'success'){
  //       const credential = firebase.auth.FacebookAuthProvider.credential(token)
  //       firebase.auth().signInWithCredential(credential)
  //         .catch(err =>{
  //           console.log(err)
  //         })
  //     }
  // }

  render(){
    return (
      <Container style={styles.container}>
        <Card>
          
            <Form>
  
              <Item floatingLabel style={styles.input}>
                <Label>Email</Label>
                <Input
                  autoCorrect = {false}
                  autoCapitalize="none"
                  onChangeText = {( email) => this.setState({ email})}
                />
              </Item>

              <Item floatingLabel style={styles.input}>
                <Label>Password</Label>
                <Input
                secureTextEntry={true}
                  autoCorrect = {false}
                  autoCapitalize="none"
                  onChangeText = {( password) => this.setState({ password})}
                />
              </Item>

              <Button style = {{ marginTop : 10, width : 200, marginLeft : 100}}
                full
                success
                onPress = {()=> this.loginUser(this.state.email, this.state.password)}
              >
                <Text style = {{color : 'white'}}>Login</Text>
              </Button>

              <Button style = {{ marginTop : 5,width : 200, marginLeft : 100, marginBottom:5}}
                full
                info
                onPress = {()=> this.signUpUser(this.state.email, this.state.password)}
              >
                <Text style = {{color : 'white'}}>Singup</Text>
              </Button>

              {/* <Button style = {{ marginTop : 10}}
                full
                rounded
                primary
                onPress = {()=> this.loginWithFacebook()}
              >
                <Text style = {{color : 'white'}}>Login with Facebook</Text>
              </Button> */}
            </Form>

        </Card>

      </Container>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding : 10,
    justifyContent: 'center',
  },
  input : {
    padding : 10,
    marginBottom : 10,
  }
});
