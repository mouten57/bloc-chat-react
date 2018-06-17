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
        this.updateInput = this.updateInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.roomsRef.on('child_added', snapshot => {
            //events registered using 'on' method
            //snapshot.val recieves snapshot object (actual data)
            const room = snapshot.val();
            // console.log(room);
            //snapshot.key contain's object key
            room.key = snapshot.key;
            // console.log(room.key);
            //concat merges/adds items to array and 
            //returns new array w/out changing existing array
            this.setState({ rooms: this.state.rooms.concat( room ) })
            //array of objects. each room is an object
            //index 0: {name: 'room1', key:'1'}
            ////////
            }); 
    }

    //keeps track of input in state  (new room data)  
    updateInput(event){
        let newRoom = event.target.value;
        this.setState({newRoom : newRoom})
        }

        //pushes new room data to firebase and clears form input   
    handleSubmit(){
        var submitData = {
            name: this.state.newRoom,
        };
        var newRoomKey = this.roomsRef.push().key;

        var updates = {};
        updates['/rooms/' + newRoomKey] = submitData;
        this.setState({ newRoom: ''});
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
                    onClick={(e) => this.props.selectRoom(room, e)}
                    >{room.name}</p>
                </div>
                )
            }
                <div className="create-form">
                    Create a New Room:
                    <input type="text" onChange={this.updateInput} value={this.state.newRoom}></input>
                    <input type="submit" onClick={this.handleSubmit} ></input>
                </div>
            </div>
            
            
        );
    }
}

export default RoomList;