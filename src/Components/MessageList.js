import React, { Component } from 'react';
import './MessageList.css';

class MessageList extends Component {
  constructor(props){
    super(props);
    this.state = {
      allMessages: [],
      roomMessages: [],
      newMessage: '',
    }
    this.messagesRef = this.props.firebase.database().ref('messages/');
  }
  //triggered when parent state changes (prop that's passed changes)
  componentWillReceiveProps(nextProps) {
    this.updateDisplayedMessages(nextProps.activeRoom);
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
      let messages = this.state.allMessages.concat( message );
      //setState of allMessages on mount
      //after state update, update displayed messages and scroll to bottom
      this.setState({ allMessages: messages },
        () => {
          this.updateDisplayedMessages(this.props.activeRoom);
          this.scrollToBottom();
          });
      });
      this.scrollToBottom();
    }
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

  convertTimestamp = (timestamp) => {
      var d = new Date(timestamp),	// Convert the passed timestamp to milliseconds
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
        dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
        ampm = 'AM',
        time;
          
      if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
      } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
      } else if (hh == 0) {
        h = 12;
      }
      
      // ie: 2013-02-18, 8:35 AM	
      time = mm + '/' + dd + '/' + yyyy + ', ' + h + ':' + min + ' ' + ampm;
      return time;
    }
  handleSubmitNewMessage = (newMessage) => {
    var submitData = {
        content: newMessage,
        sentAt: this.convertTimestamp(Date.now()),
        roomId: this.props.activeRoom.key,
        username: this.props.user ? this.props.user.displayName : "Guest"
    };
    var newMessageKey = this.messagesRef.push().key;
    var updates = {};
    updates['/messages/' + newMessageKey] = submitData;
    if (submitData.content.length >= 1){
        this.setState({ newMessage: ''});
        return this.props.firebase.database().ref().update(updates);}
    else {alert('Message must be at least 1 character.')}
}
  handleMessageInput = (event) => {
    let newMSG = event.target.value;
    this.setState({newMessage: newMSG})
  }
  //takes activeRoom from componentwillreceiveprops on props change(active room change)
  //also takes activeRoom from componentDidMount on room load
  //filters messages to only those that match correct room, then sets state
  //finally, scrolls to bottom
  updateDisplayedMessages=(activeRoom)=> {
    this.setState(
      {
        roomMessages: this.state.allMessages.filter(
          message => message.roomId === activeRoom.key
        )
      },
      () => this.scrollToBottom()
    );
  }
  render () {
    return(
      <div className="message-list-div">
        <ul className="message-list">
          {/* //map roomMessages instead of allMessages */}
            {this.state.roomMessages.map( message => 
            <li key={message.key}>
                <div className="content">
                    {message.content}<br/>
                    From: {message.username}<br/>
                    Time: {message.sentAt}<br/>
                    <br/>
                </div>
            </li>
          )}
          {/* ref can't be in a map function ?? */}
          <div ref={(el) => (this.messagesEnd = el)}/>
          </ul>
          <div id="message-bar">
          <form id="message-form"
            onSubmit={ (e) => { e.preventDefault(); this.handleSubmitNewMessage(this.state.newMessage) }}>
          <input id='message-input' type="text" onChange={this.handleMessageInput} value={this.state.newMessage} placeholder="Enter a message.." />
          <input type="submit" id='msg-sub'/>
        </form>
      </div>
    </div>
    );
  }
}

export default MessageList;