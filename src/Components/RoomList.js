import React, { Component } from 'react';

class RoomList extends Component {
    constructor(props) {
        super(props);

        this.state = {
           rooms: [],
           newRoom: '', 
        };
        this.roomsRef = this.props.firebase.database().ref('rooms');
        console.log(this.roomsRef);
        this.updateInput = this.updateInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.roomsRef.on('child_added', snapshot => {
            //events registered using 'on' method
            //snapshot.val recieves snapshot object (actual data)
            const room = snapshot.val();
            console.log(room);
            //snapshot.key contain's object key
            room.key = snapshot.key;
            console.log(room.key);
            //concat merges/adds items to array and 
            //returns new array w/out changing existing array
            this.setState({ rooms: this.state.rooms.concat( room ) })
            //array of objects. each room is an object
            //index 0: {name: 'room1', key:'1'}
            console.log(this.state.rooms)
        });
        
    }   
    //keeps track of input in state    
    updateInput(event){
        let newRoom = event.target.value;
        this.setState({newRoom : newRoom})
        }
        
    //does something with the value from text input    
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
            <div>
                <h1 className="side-nav-header">Bloc Chat</h1>
            {
                this.state.rooms.map( (room, index) =>    
                <div key={index}>
                    <p 
                    className="room-number"
                    
                    >{room.name}</p>
                </div>
                )
            }
           
                <div>
                    <input type="text" onChange={this.updateInput} value={this.state.newRoom}></input>
                    <input type="submit" onClick={this.handleSubmit} ></input>
                </div>
            </div>
            
            
        );
    }
}

export default RoomList;