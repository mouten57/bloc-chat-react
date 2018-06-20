import React, { Component } from 'react';
import './RoomList.css'

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
        this.props.selectRoom(onSubmitNewRoom);
        this.setState({ newRoom: ''});
        return this.props.firebase.database().ref().update(updates);
    }
    removeRoom = (room) => {
        this.roomsRef.child(room.key).remove();
        this.props.selectRoom(this.state.rooms[this.state.rooms.length -2]);
      }
    render() {

        return (
            <div className="side-nav">
                <h4 className="side-nav-header">Select a Room:</h4>
            {
                this.state.rooms.map( room =>    
                <div key={room.key}>
                    <p 
                    className="room-number"
                    onClick={(e) => this.props.selectRoom(room, e)}
                    >{room.name}</p>
                    <button 
                        className="delete-room-button"
                        onClick={() => this.removeRoom(room)}>-</button>
                </div>
                )
            }
                <form 
                    className="create-form"
                    onSubmit={(e) => { e.preventDefault(); this.handleSubmit(this.state.newRoom); }}>
                    Create a New Room:
                    <input id="room-txt" type="text" onChange={this.updateInput} value={this.state.newRoom}></input>
                    <input id="room-sub" type="submit"></input>
                </form>
            </div>
            
            
        );
    }
}

export default RoomList;