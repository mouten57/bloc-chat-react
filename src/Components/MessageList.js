import React, { Component } from "react";
import styles from "../Styles/MessageList.module.css";
import { Icon, Button, Input, Comment } from "semantic-ui-react";
import sample_person from "../Images/sample_person.jpeg";
class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allMessages: [],
      roomMessages: [],
      newMessage: "",
    };
    this.messagesRef = this.props.firebase.database().ref("messages/");
  }
  //triggered when parent state changes (prop that's passed changes)
  componentWillReceiveProps(nextProps) {
    this.updateDisplayedMessages(nextProps.activeRoom);
  }
  componentDidMount() {
    this.messagesRef.on("child_added", (snapshot) => {
      //events registered using 'on' method
      //snapshot.val recieves snapshot object (actual data)
      const message = snapshot.val();
      //snapshot.key contain's object key
      message.key = snapshot.key;
      //concat merges/adds items to array and
      //returns new array w/out changing existing array
      let messages = this.state.allMessages.concat(message);
      //setState of allMessages on mount
      //after state update, update displayed messages and scroll to bottom
      this.props.setMessages(messages);
      this.setState({ allMessages: messages }, () => {
        this.updateDisplayedMessages(this.props.activeRoom);
        this.scrollToBottom();
      });
    });
    this.messagesRef.on("child_removed", (snapshot) => {
      this.setState(
        {
          allMessages: this.state.allMessages.filter(
            (message) => message.key !== snapshot.key
          ),
        },
        () => {
          this.updateDisplayedMessages(this.props.activeRoom);
        }
      );
    });
    this.scrollToBottom();
  }
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  convertTimestamp = (timestamp) => {
    const month = {
      "01": "Jan",
      "02": "Feb",
      "03": "Mar",
      "04": "Apr",
      "05": "May",
      "06": "June",
      "07": "July",
      "08": "Aug",
      "09": "Sep",
      "10": "Oct",
      "11": "Nov",
      "12": "Dec",
    };
    var d = new Date(timestamp), // Convert the passed timestamp to milliseconds
      yyyy = d.getFullYear(),
      mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
      dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
      hh = d.getHours(),
      h = hh,
      min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
      ampm = "AM",
      time;

    //     if (hh > 12) {
    //       h = hh - 12;
    //       ampm = "PM";
    //     } else if (hh === 12) {
    //       h = 12;
    //       ampm = "PM";
    //     } else if (hh === 0) {
    //       h = 12;
    //     }

    // ie: 2013-02-18, 8:35 AM
    time =
      month[mm] +
      " " +
      dd +
      " '" +
      yyyy.toString().slice(2, 4) +
      " at " +
      h +
      ":" +
      min;
    return time;
  };
  handleSubmitNewMessage = (newMessage) => {
    var submitData = {
      content: newMessage,
      sentAt: this.convertTimestamp(Date.now()),
      roomId: this.props.activeRoom.key,
      username: this.props.user ? this.props.user.displayName : "Guest",
      userID: this.props.user ? this.props.user.uid : "None",
      userPhotoUrl: this.props.user ? this.props.user.photoURL : sample_person,
    };
    var newMessageKey = this.messagesRef.push().key;
    var updates = {};
    updates["/messages/" + newMessageKey] = submitData;
    if (submitData.content.length >= 1) {
      this.setState({ newMessage: "" });
      return this.props.firebase.database().ref().update(updates);
    } else {
      alert("Message must be at least 1 character.");
    }
  };
  handleMessageInput = (event) => {
    let newMSG = event.target.value;
    this.setState({ newMessage: newMSG });
  };
  //takes activeRoom from componentwillreceiveprops on props change(active room change)
  //also takes activeRoom from componentDidMount on room load
  //filters messages to only those that match correct room, then sets state
  //finally, scrolls to bottom
  updateDisplayedMessages = (activeRoom) => {
    this.setState(
      {
        roomMessages: this.state.allMessages.filter(
          (message) => message.roomId === activeRoom.key
        ),
      },
      () => this.scrollToBottom()
    );
  };

  deleteMessage = (message) => {
    let array = [...this.state.roomMessages];
    var index = array.indexOf(message);
    array.splice(index, 1);
    this.setState({ roomMessages: array });
    this.messagesRef
      .child(message.key)
      .remove()
      .then(() => {
        // check the browser console to see if this works... or throws an error if it is not a promise
        console.log(`${message.content} removed`);
        // if it is a promise we now could call remove on the messages
      });
  };

  render() {
    console.log(this.state.roomMessages);
    return (
      <div className={styles.messageListDiv}>
        <Comment.Group
          style={{
            marginLeft: "10px",
            marginRight: "10px",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          {/* <ul className={styles.messageList}> */}
          {/* //map roomMessages instead of allMessages */}
          {this.state.roomMessages.map((message) => (
            <Comment
              key={message.key}
              style={{
                marginLeft: this.props?.user
                  ? this.props.user.uid === message.userID
                    ? "50%"
                    : "0"
                  : "0",
                maxWidth: "230px",
              }}
            >
              <Comment.Avatar as="a" src={message.userPhotoUrl} />
              <Comment.Content>
                <Comment.Author>{message.username}</Comment.Author>
                <Comment.Metadata>
                  <div>{message.sentAt}</div>
                  {this.props?.user?.uid == message.userID ? (
                    <Icon
                      name="delete"
                      style={{
                        marginRight: "10px",

                        float: "right",
                      }}
                      onClick={() => this.deleteMessage(message)}
                      className={styles.deleteButton}
                    />
                  ) : null}
                </Comment.Metadata>

                <Comment.Text>{message.content}</Comment.Text>
              </Comment.Content>
            </Comment>
          ))}
          {/* ref can't be in a map function ?? */}
        </Comment.Group>
        <div ref={(el) => (this.messagesEnd = el)} />
        {/* </ul> */}
        <div className={styles.messageBar}>
          <div className={styles.formWrapper}>
            <form
              className={styles.messageForm}
              onSubmit={(e) => {
                e.preventDefault();
                this.handleSubmitNewMessage(this.state.newMessage);
              }}
            >
              <Input
                className={styles.messageInput}
                type="text"
                onChange={this.handleMessageInput}
                value={this.state.newMessage}
                placeholder="Enter a message.."
              />
              <Button
                type="submit"
                style={{ marginTop: "15px" }}
                className={styles.msgSub}
              >
                Send
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default MessageList;
