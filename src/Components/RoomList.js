import React, { Component } from 'react';
import styles from './RoomList.css';

class RoomList extends Component {
    constructor(props) {
        super(props);

        this.state = {
           rooms: [],
           newRoom: '', 
        };
        this.roomsRef = this.props.firebase.database().ref('rooms');
    }
    componentDidMount() {
        this.roomsRef.on('child_added', snapshot => {
            //events registered using 'on' method
            //snapshot.val recieves snapshot (room object data)
            const room = snapshot.val();
            //snapshot.key contain's object key
            room.key = snapshot.key;
            //concat merges/adds items to array and 
            //returns new array w/out changing existing array
            this.setState({ rooms: this.state.rooms.concat( room ) })
            //stops loading at 1 and sets first room to activeRoom
            //only calls once
            if (this.state.rooms.length === 1) {
                this.props.selectRoom(room);
              }
            //array of objects. each room is an object
            //index 0: {name: 'room1', key:'1'}
            ////////
            }); 
            this.roomsRef.on("child_removed", snapshot => {
                this.setState({
                  rooms: this.state.rooms.filter(room => room.key !== snapshot.key)
                });
              });
    }
    //keeps track of input in state  (new room data)  
    updateInput = (event) => {
        let newRoom = event.target.value;
        this.setState({newRoom : newRoom})
        }
        //pushes new room data to firebase and clears form input  
    handleSubmit = (newRoom) => {
        var submitData = {
            name: newRoom,
        };
        var newRoomKey = this.roomsRef.push().key;
        var updates = {};
        updates['/rooms/' + newRoomKey] = submitData;
        //updates the room that was submitted to activeRoom
        let onSubmitNewRoom = {
            name: newRoom,
            key: newRoomKey
        }
        let roomNames = [...this.state.rooms.map(room => room.name)];
        if (roomNames.includes(newRoom)){
            alert('Room name is already taken.')
            this.setState({ newRoom: '' });
        } else if (newRoom.length > 12){
            alert('Please create a room name shorter than 12 characters.');
            this.setState({ newRoom: ''});
        } else {
            this.props.selectRoom(onSubmitNewRoom);
            this.setState({ newRoom: ''});
            return this.props.firebase.database().ref().update(updates);}
    } 
    // loop over messages
    // check if message.roomKey === deletedRoom.key
    // if true call the delete
    // if false nothing
      removeRoom = (room) => {
        if (this.state.rooms.length<2){return}
        var array = [...this.state.rooms];
        var index = array.indexOf(room);
        array.splice(index, 1);
        this.setState({rooms: array})
        this.roomsRef.child(room.key).remove().then(() => {
            // check the browser console to see if this works... or throws an error if it is not a promise
            for (let i=0; i<this.props.allMessages.length; i++) {
            let message = this.props.allMessages[i];
            if (message.roomId === room.key){
                this.props.firebase.database().ref('messages/').child(message.key).remove();
            }
            }
            console.log(`${room.key} removed`);
           // if it is a promise we now could call remove on the messages
         });
        this.state.rooms[index+1] ?
            this.props.selectRoom(this.state.rooms[index+1]) :
            this.props.selectRoom(this.state.rooms[index-1]);
      }
    render() {

        return (
            <div className={styles.sideNav}>
                <h4>Select a Room:</h4>
            {
                this.state.rooms.map( room =>    
                <div key={room.key}>
                    <p 
                    className={styles.roomNumber}
                    onClick={() => this.props.selectRoom(room)}
                    >{room.name}</p>
                    <button 
                        className={styles.deleteRoomButton}
                        onClick={() => this.removeRoom(room)}>-</button>
                </div>
                )
            }
                <form 
                    className={styles.createForm}
                    onSubmit={(e) => { e.preventDefault(); this.handleSubmit(this.state.newRoom); }}>
                    Create a New Room:
                    <input id={styles.roomTxt} type="text" onChange={this.updateInput} value={this.state.newRoom}></input>
                    <input className={styles.roomSub} type="submit"></input>
                </form>
            </div>
            
            
        );
    }
}

export default RoomList;