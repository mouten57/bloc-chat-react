import React, { Component } from 'react';

class RoomList extends Component {
    constructor(props) {
        super(props);

        this.state = {
           rooms: [], 
        };
        this.roomsRef = this.props.firebase.database().ref('rooms');
        console.log(this.roomsRef);
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
            console.log(this.state.rooms.concat( room ));
            //array of objects. each room is an object
            //index 0: {name: 'room1', key:'1'}
        });
    }

    render() {

        return (
            <div>
                <h1 className="side-nav-header">Bloc Chat</h1>
            {
                this.state.rooms.map( (room, index) =>    
                <div key={index}>
                    <p className="room-number">{room.name}</p>
                </div>
                )
    
            }
            </div>
        );
    }
}

export default RoomList;