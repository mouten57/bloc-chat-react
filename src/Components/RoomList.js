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
        //events registered using 'on' method
        this.roomsRef.on('child_added', snapshot => {
             //snapshot.val recieves snapshot object (actual data)
            const room = snapshot.val();
            //snapshot.key contain's object key
            room.key = snapshot.key;
            //concat merges/adds items to array and 
            //returns new array w/out changing existing array
            this.setState({ rooms: this.state.rooms.concat( room ) })
            //array of objects. each room is an object
            //index 0: {name: 'room1', key:'1'}
            ////////
            }); 
    }
    //keeps track of input (new room data) and updates state
    handleInput = (event) => {
        let newRoom = event.target.value;
        this.setState({newRoom : newRoom})
        }

    //pushes new room data to firebase and clears form input   
    handleSubmit = () => {
        var submitData = {
            name: this.state.newRoom,
        };
        var newRoomKey = this.roomsRef.push().key;
        var updates = {};
        updates['/rooms/' + newRoomKey] = submitData;
        //clear input
        this.setState({ newRoom: ''});
        //send update
        return this.props.firebase.database().ref().update(updates);
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
                    onClick={() => this.props.selectRoom(room)}
                    >{room.name}</p>
                </div>
                )
            }
                <div className="create-form">
                    Create a New Room:
                    <input type="text" onChange={this.handleInput} value={this.state.newRoom}></input><br />
                    <input id="room-sub" type="submit" onClick={this.handleSubmit} ></input>
                </div>
            </div>
        );
    }
}

export default RoomList;