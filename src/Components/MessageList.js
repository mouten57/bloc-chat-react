import React, { Component } from 'react';
import './MessageList.css';

class MessageList extends Component {
    constructor(props){
        super(props);
        this.state = {
            messages: [],
            username: "",
            content: "",
            sentAt:"",
            roomId: ""

        }
        this.roomsRef = this.props.firebase.database().ref('messages');
    }
    componentDidMount() {
        this.roomsRef.on('child_added', snapshot => {
            //events registered using 'on' method
            //snapshot.val recieves snapshot object (actual data)
            const message = snapshot.val();
            // console.log(message);
            //snapshot.key contain's object key
            message.key = snapshot.key;
            // console.log(message.key);
            //concat merges/adds items to array and 
            //returns new array w/out changing existing array
            let newMessages = this.state.messages.concat( message );
            this.setState({ messages: newMessages })
            // console.log(this.state.messages.concat( message ));
            //array of objects. each room is an object
            //index 0: {name: 'room1', key:'1'}
        });
    }

    render () {
        return(
            <div className="message-list">
                <h1>YO</h1>
            </div>
        );
    }
}

export default MessageList;