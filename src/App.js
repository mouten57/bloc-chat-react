import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';
import RoomList from './Components/RoomList';

var config = {
  apiKey: "AIzaSyCX4BNKBh-M3Yj7MTMRGUD-ZAr0c8gtYHk",
  authDomain: "bloc-chat-7019f.firebaseapp.com",
  databaseURL: "https://bloc-chat-7019f.firebaseio.com",
  projectId: "bloc-chat-7019f",
  storageBucket: "bloc-chat-7019f.appspot.com",
  messagingSenderId: "676667791815"
};
firebase.initializeApp(config);

const sideNavStyle = {
  width: '25%',
  minWidth: '170px',
  height: '100%',
  backgroundColor: 'lightGrey',
  position: 'fixed!important',
  zIndex: '1',
  overflow: 'auto',
}
const appStyle = {
  height: '550px',
  border: '1px dotted grey'
}

class App extends Component {
  render() {
    return (
      <div className="App" style={appStyle}>
        <div style={sideNavStyle} className="sidebarNav">
          <RoomList
            firebase = {firebase}
          />
        
        </div>   
      </div>
    );
  }
}

export default App;
