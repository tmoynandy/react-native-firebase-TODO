import React, {Component} from 'react';
import { Container, Header, View, Button, Icon, Fab, Text,  Content, CheckBox, Body , ListItem, Form, Item, Input } from 'native-base';
import { StyleSheet, Modal, Platform, ScrollView  } from 'react-native';
import * as firebase from 'firebase'
import {SwipeableFlatList} from 'react-native-swipeable-flat-list';

// var data = ["todo 1", "todo 2"]

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

export default class Tasks extends Component {

    state = {
        active : false,
        ModalVisibleStatus: false,
        data : [{ key: 1, todo: 'Label 1', checked: true, user : 'user1' },
        { key: 2, todo: 'Label 2', checked:  false, user : 'user1' }],
        checkBoxColor : 'red',
        formData : {todo : '', checked : false},
        formValid : {todoSubmitButton : false},
        refresh : false
    }

    fabPress = (visible) =>{
        this.setState({ active: !this.state.active })
        this.setState({ModalVisibleStatus: visible});
    }

    //will be called when the todo input field has onchange
    onTodoChange = (todo) =>{
      console.log("todo being received", todo)
      if(todo.length > 0){
        let formDataObj = this.state.formData;
        formDataObj.todo = todo;
        this.setState({formData : formDataObj})
        this.setState({formValid : true})
      }
      
    }

    //will be called when add todo button will be pressed
    //submit data to firestore here
    onTodoSubmit = () =>{
      // console.log("called submit")
      let key = Math.floor(Math.random()*1000001)
      let newTodoData = this.state.formData
      newTodoData.key = key
      newTodoData.user = this.props.loggedInUser
      // let dataCopy = [...this.state.data, newTodoData]
      // console.log("new data to be inserted",dataCopy)
      // this.setState({data : dataCopy})  
      // let dataCopy = [...this.state.data, newTodoData]
      // this.setState({data : dataCopy})
      firebase.database().ref('Todos/').push(newTodoData)
        .then((data) =>{
          console.log("successful post", data)
        })
        .catch((err)=>{
          console.log("error in posting data", err)
        })
        // this.setState({refresh : !this.state.refresh})
        // this.componentDidMount()
    }

    checkBoxPress = (index) =>{
      let dataCopy = this.state.data
      let dataObjectCopy = dataCopy[index]
      dataObjectCopy.checked = !dataObjectCopy.checked
      dataCopy[index] = dataObjectCopy
      // console.log(dataObj)
      this.setState({data : dataCopy})
    }

    //fetches TODO from firebase and stores in this.state.data
    async componentDidMount () {
      // console.log("in mount")
      // this.readData().then(res =>{
      //   console.log(res)
      // })
      
      firebase.database().ref('Todos/').on('value', snapshot =>{
        let firebaseData = []
        let authUserData = []
        firebaseData = [...Object.values(snapshot.val())]
        firebaseData.map(data =>{
          if(data.user === this.props.loggedInUser){
            authUserData.push(data)
          }
        })
        console.log("data fetched from firebase", firebaseData)
        console.log("data for auth user", authUserData)
        let dataCopy = [...this.state.data, ...authUserData]
        this.setState({data : dataCopy})
      })
    } 

    

    // readData = () => {
    //   return new Promise(resolve => {
    //     let firebaseData = []
    //       firebase.database().ref('Todos/').on('value', function (snapshot){
    //         firebaseData = [...Object.values(snapshot.val())]
    //         console.log("data fetched from firebase",firebaseData)
    //       })
    //     let dataCopy = [...this.state.data, ...firebaseData]
    //     console.log("finalData",dataCopy)
    //     this.setState({data : dataCopy})
    //     resolve('done')
    //   })
      
    // }

  render() {
    return (
      <ScrollView style={styles.scrollView}>  
      <Container>


          {/* START OF MODAL */}
          <Modal
          transparent={false}
 
          animationType={"slide"}
 
          visible={this.state.ModalVisibleStatus}
 
          onRequestClose={ () => { this.fabPress(!this.state.ModalVisibleStatus)} } >
 
            <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.ModalInsideView}>
 
                    {/* Put All Your Components Here, Which You Want To Show Inside The Modal. */}
 
                    <Form>
                        <Item>
                        <Input placeholder="New TODO" 
                          onChangeText = { (value) => {this.onTodoChange(value)}} 
                        />
                        </Item>
                        <Button style = {{ marginTop : 10, width : 65, marginLeft : 140}}
                            primary
                            onPress = {() =>{this.onTodoSubmit()}}
                        >
                            <Text style = {{color : 'white'}}>ADD</Text>
                        </Button>
                    </Form>

                    {/* FAB of close button */}
                    <Fab
                        active={this.state.active}
                        // direction="up"
                        containerStyle={{ }}
                        style={{ backgroundColor: '#5067FF' }}
                        position="topRight"
                        onPress={() => { this.fabPress(!this.state.ModalVisibleStatus)}}>
                            <Icon name="close" />
                    </Fab>
                    {/* Put All Your Components Here, Which You Want To Show Inside The Modal. */}
                </View>
            </View>
        </Modal>
          {/* END OF MODAL */}

          {/* START OF DONE LIST */}
          <View style = {styles.container}>
          <Text style={{ marginLeft : 8}}>Completed</Text>
            {this.state.data.map((todos, index) =>{
              let count = 0
              let color = ""
              if(todos.checked)
                color = "green"
              else
                color = "red"
              count++
              if(todos.checked){
                return(
                    <ListItem key = {todos.key}>
                        <CheckBox checked = {todos.checked} color = {color} onPress = {()=>{this.checkBoxPress(index)}} />
                        <Body>
                          <Text>{todos.todo}</Text>
                        </Body>
                    </ListItem>
                  
                )
              }
             
            })}
          </View>
          {/* END OF DONE LIST  */}

          {/* START OF NOT DONE LIST */}
          <ScrollView style={styles.scrollView}>
          <Content>
            <Text style = {{ marginLeft : 8}}>Not Completed</Text>
            {this.state.data.map((todos, index) =>{
              let color = ""
              if(todos.checked)
                color = "green"
              else
                color = "red"
              if(!todos.checked){
                return(
                  <Content key = {todos.key}>
                  {/* <Text>Not Completed</Text> */}
                  <ListItem >
                      <CheckBox checked = {todos.checked} color = {color} onPress = {()=>{this.checkBoxPress(index)}} />
                      <Body>
                        <Text>{todos.todo}</Text>
                      </Body>
                  </ListItem>
                  </Content>

                )
              }
             
            })}
          </Content>
          </ScrollView>
          {/* END OF NOT DONE LIST  */}

        {/* start of FAB  */}
        <View style={{ flex: 1 }}>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#5067FF' }}
            position="bottomRight"
            onPress={() => this.fabPress(true)}>
                <Icon name="add" />
          </Fab>
        </View>
        {/* end of FAB  */}

      </Container>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
 
    MainContainer :{
        
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: (Platform.OS == 'ios') ? 20 : 0
     
    },

    container: {
      flexDirection: "column",
      //flex: 1, 
      padding: 10
    },

    scrollView: {
      // backgroundColor: 'pink',
      marginHorizontal: 10,
    },
     
    ModalInsideView:{
     
      justifyContent: 'center',
    //   alignItems: 'center', 
      backgroundColor : "#00BCD4", 
      height: 300 ,
      width: '90%',
      borderRadius:10,
      borderWidth: 1,
      borderColor: '#fff',
      padding : 20
     
    },
     
    TextStyle:{
     
      fontSize: 20, 
      marginBottom: 20, 
      color: "#fff",
      padding: 20,
      textAlign: 'center'
     
    }
     
    });