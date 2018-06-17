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
      activeRoom: "",
      activeRoomKey: "",
    }
    this.selectRoom=this.selectRoom.bind(this);
  }

  selectRoom(room) {
    // this.setState({ activeRoom: e.currentTarget.textContent });
    let activeRoomKey = room.key;
    let activeRoom = room.name;
    this.setState({ activeRoom : activeRoom});
    this.setState({ activeRoomKey: activeRoomKey });
    console.log(activeRoomKey+": "+ activeRoom)
}

  render() {
    return (
      <div className="App">
        <div>
          <RoomList 
          firebase = {firebase}
          activeRoom={this.state.activeRoom}
          selectRoom={this.selectRoom}
          />
        </div>
        <div id='current-room'>
          <h4 className="current-room">Current Room: </h4>
          <h4 className='room-title'>{this.state.activeRoom}</h4>
        </div>
        <div>  
          <MessageList 
            firebase = {firebase}
            activeRoom={this.state.activeRoom}
            username='matt'
            activeRoomKey={this.state.activeRoomKey} />  
          </div>
      </div>
    );
  }
}

export default App;
