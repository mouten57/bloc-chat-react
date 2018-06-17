import React, { Component } from 'react';
import './MessageList.css';

class MessageList extends Component {
    constructor(props){
        super(props);
        this.state = {
            Messages: [],
            newMessage: '',
        }
        this.messagesRef = this.props.firebase.database().ref('messages');
        this.handleMessageInput = this.handleMessageInput.bind(this);
        this.handleSubmitNewMessage = this.handleSubmitNewMessage.bind(this);

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
            let newMessages = this.state.Messages.concat( message );
            this.setState({ Messages: newMessages }, () => {
            this.scrollToBottom();
            })
        });
    }

    componentDidUpdate() {
        this.scrollToBottom();
      }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
      }

    handleSubmitNewMessage(){
        var submitData = {
            content: this.state.newMessage,
            sentAt: this.props.firebase.database.ServerValue.TIMESTAMP,
            roomId: this.props.activeRoomKey,
            username: this.props.username,
        };
        var newMessageKey = this.messagesRef.push().key;
        var updates = {};
        updates['/messages/' + newMessageKey] = submitData;
        this.setState({ newMessage: ''});
        return this.props.firebase.database().ref().update(updates);
    }

    handleMessageInput(event) {
        let newMSG = event.target.value;
        this.setState({newMessage: newMSG})
    }

    render () {
        return(
            <div 
                className="message-list-div"
                >
                <ul className="message-list">
                    {this.state.Messages.map( message =>
                    <li key={message.key}>
                        <div 
                        className="content"
                        ref={(el)=> {this.messagesEnd = el; }}>
                        {message.content}<br/>
                        From: {message.username}<br/>
                        Time: {message.sentAt}<br/>
                        Room Key: {message.roomId}<br/><br/>
                        </div>
                    </li>
                    )}
                </ul>
                <div id="message-submit">
                    <form id="message-form"
                        onSubmit={ (e) => { e.preventDefault(); this.handleSubmitNewMessage(this.state.newMessage) }}>
                        <input type="text" onChange={this.handleMessageInput} value={this.state.newMessage} placeholder="Enter a message.." />
                        <input type="submit"/>
                    </form>
                </div>
            </div>
        );
    }
}

export default MessageList;