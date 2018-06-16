import React, { Component } from 'react';
import './MessageList.css';

class MessageList extends Component {
    constructor(props){
        super(props);
        this.state = {
            allMessages: [],
            displayedMessages: [],
            newMessage: '',
        }
        this.messagesRef = this.props.firebase.database().ref('messages');
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    componentDidMount() {
        this.messagesRef.on('child_added', snapshot => {
            //events registered using 'on' method
            //snapshot.val recieves snapshot object (actual data)
            const message = snapshot.val();
            // console.log(message);
            //snapshot.key contain's object key
            message.key = snapshot.key;
            // console.log(message.key);
            //concat merges/adds items to array and 
            //returns new array w/out changing existing array
            let newMessages = this.state.allMessages.concat( message );
            this.setState({ allMessages: newMessages }, () => {
            this.updateDisplayedMessages;
            })
            console.log('abc'+ message.key)
            // console.log(this.state.messages.concat( message ));
            //array of objects. each room is an object
            //index 0: {name: 'room1', key:'1'}
        });
    }
    handleSubmit(){
        var submitData = {
            content: this.state.newMessage,
            sentAt: Date.now(),
            roomId: this.props.activeRoom,
        };
        var newMessageKey = this.messagesRef.push().key;

        var updates = {};
        updates['/messages/' + newMessageKey] = submitData;
        this.setState({ newMessage: ''});
        return this.props.firebase.database().ref().update(updates);
    }

    updateDisplayedMessages() {
        this.setState({ displayedMessages: this.state.allMessages})
    }

    handleChange(event) {
        let newMSG = event.target.value;
        this.setState({newMessage: newMSG})
    }

    render () {
        return(
            <div className="message-list-div">
                <ul className="message-list">
                    {this.state.allMessages.map( message =>
                    <li key={message.key}>
                        <div className="content">
                        {message.content} from: {message.username} at: {message.sentAt}
                        </div>
                    </li>
                    )}
                </ul>
                <form onSubmit={ (e) => { e.preventDefault(); this.handleSubmit(this.state.newMessage) } }>
                    <input type="text" onChange={this.handleChange} value={this.state.newMessage}  />
                    <input type="submit"/>
                </form>
            </div>
        );
    }
}

export default MessageList;