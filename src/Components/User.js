import React, { Component } from 'react';
import "./User.css";

class User extends Component {
    componentDidMount() {
        this.props.firebase.auth().onAuthStateChanged( user => {
            this.props.setUser(user);
          });
    }
    signIn = () => {
        const provider = new this.props.firebase.auth.GoogleAuthProvider();
        this.props.firebase.auth().signInWithPopup( provider );
    }

    signOut = () => {
        this.props.firebase.auth().signOut();
    }

    render () {
        return(
            <div id="sign-in-out">
                <button onClick={() => this.signIn()}>Sign In</button>
                <button onClick={() => this.signOut()}>Sign Out</button>
                <div id='username-display'>Username: {this.props.user ? this.props.user.displayName : "Guest" }</div>
            </div>
        );}
}

export default User;