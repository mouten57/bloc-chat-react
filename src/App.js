import React, { Component } from 'react';
import styles from './App.css';
import RoomList from './Components/RoomList';
import MessageList from './Components/MessageList';
import User from './Components/User';

import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

import config from './firebaseConfig';

firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRoom: '',
      user: '',
      allMessages: ''
    };
  }

  //takes selected room from onClick in RoomList.js (from map function)
  selectRoom = room => {
    this.setState({ activeRoom: room });
  };

  setUser = user => {
    this.setState({ user: user });
  };

  setMessages = messages => {
    this.setState({ allMessages: messages });
  };

  render() {
    return (
      <div className={styles.App}>
        <RoomList
          firebase={firebase}
          activeRoom={this.state.activeRoom}
          selectRoom={this.selectRoom}
          allMessages={this.state.allMessages}
        />

        <div className={styles.currentRoomDisplay}>
          <ul className={styles.topDisplay}>
            <li className={styles.currentRoom}>
              <b>Current Room</b>:{' '}
              <p className={styles.roomTitle}>
                {this.state.activeRoom ? this.state.activeRoom.name : ''}
              </p>
            </li>
            <li className={styles.usernameDisplay}>
              <b>Username</b>:{' '}
              <p className={styles.userTitle}>
                {this.state.user ? this.state.user.displayName : 'Guest'}
              </p>
            </li>
          </ul>

          <User
            className={styles.user}
            firebase={firebase}
            setUser={this.setUser}
            user={this.state.user}
          />
        </div>

        <MessageList
          firebase={firebase}
          activeRoom={this.state.activeRoom}
          user={this.state.user}
          setMessages={this.setMessages}
        />
      </div>
    );
  }
}

export default App;
