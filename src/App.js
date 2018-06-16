import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';
import RoomList from './Components/RoomList';
import MessageList from './Components/MessageList';

var config = {
  apiKey: "AIzaSyCX4BNKBh-M3Yj7MTMRGUD-ZAr0c8gtYHk",
  authDomain: "bloc-chat-7019f.firebaseapp.com",
  databaseURL: "https://bloc-chat-7019f.firebaseio.com",
  projectId: "bloc-chat-7019f",
  storageBucket: "bloc-chat-7019f.appspot.com",
  messagingSenderId: "676667791815"
};
firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRoom: "Room 1",
    }
    this.selectRoom=this.selectRoom.bind(this);
  }

  selectRoom(event) {
    console.log(event.currentTarget.textContent)
    this.setState({activeRoom: event.currentTarget.textContent});
  }
   
  render() {
    return (
      <div className="App">
        <div>
          <RoomList 
          firebase = {firebase}
          selectRoom={this.selectRoom}
          />
        </div>
        <div>
          <h4 className="current-room">Current Room: 
            <div className='room-title'>{this.state.activeRoom}</div>
          </h4>
          <MessageList 
            firebase = {firebase}
            activeRoom={this.state.activeRoom} />  
        </div>
      </div>
    );
  }
}

export default App;
