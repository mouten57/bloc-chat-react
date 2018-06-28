import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';
import RoomList from './Components/RoomList';
import MessageList from './Components/MessageList';
import User from './Components/User';

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
      activeRoom: '',
      user: '',
    };
  }
  
  //takes selected room from onClick in RoomList.js (from map function)
  selectRoom = (room) => {
    this.setState({ activeRoom: room });
  }

  setUser = (user) => {
    this.setState({ user: user})
  };

 
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
          <div id='current-room2'>
            <ul className="top-display">
              <li className="current-room">Current Room: <p className='room-title'>{this.state.activeRoom ? this.state.activeRoom.name:''}</p></li>
              <li id='username-display'>Username: <b>{this.state.user ? this.state.user.displayName : "Guest" }</b></li>
            </ul>
              <User 
                firebase = {firebase}
                setUser = {this.setUser}
                user = {this.state.user} />
            </div>
          </div>
        <div>
        <MessageList
          firebase = {firebase}
          activeRoom={this.state.activeRoom}
          user={this.state.user}
        />
        </div>
      </div>
    );
  }
}

export default App;
