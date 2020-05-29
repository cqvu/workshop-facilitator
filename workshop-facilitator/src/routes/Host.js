import React from "react";
import SplitPane from 'react-split-pane';
import '../styles/Host.css';
import SendMail from '../components/SendMail';
import Resources from "../components/Resources";
import QContainer from "../components/QContainer";
import Polls from "../components/Polls";


import Button from "@material-ui/core/Button";

import HostCode from "../components/HostCode";
import JoinCode from "../components/JoinCode";

import yes from "../hostUserIcons/yesIcon.png";
import no from "../hostUserIcons/noIcon.png";

import io from "socket.io-client";


let socket;

class Host extends React.Component {
    constructor() {
        super();

        this.state = {
            // should be the same as the port you're using for server
            ENDPOINT: "localhost:5000",
            room: null,
            hostCode: "",
            joinCode: "",
            id: null,
            slowerPeople: 0,
            yesCount: 0,
            noCount:0
        }
    }

    componentDidMount(){
        /*
        make the connection to the socket (when user visits this component,
        connection event will be emitted because of this connection)

        now, there exists a websocket between this client and our server, so
        we can emit events to our server
        */
        socket = io(this.state.ENDPOINT);

        if(this.props.location.state != null){
            // join the socket room for this workshop room
            const roomID = this.props.location.state.roomID;
            this.setState({id: roomID});
            socket.emit("join", {name: roomID});
            
        socket.on("yesClick", () =>{
            console.log("someone clicked yes");
            this.setState({yesCount: (this.state.yesCount+ 1)});
            console.log("yesclicked: "  +  this.state.yesCount);

        })

        socket.on("noClick", () =>{
            console.log("someone clicked no");
            this.setState({noCount: (this.state.noCount+ 1)});
            console.log("noClicked: " +  this.state.noCount);

        })

        //will fetch the room given the ID if it was passed it, saves it in state
        //if(this.props.location.state != null){
            console.log("Here is the ID: " + this.props.location.state.roomID);
            this.setState({
                id: this.props.location.state.roomID
            })
            //this.setState( {roomID: this.props.location.state.roomID} );
            //console.log("Here is the ID that was passed: " +  this.state.roomID);
            let getString = "http://localhost:5000/rooms/" + this.props.location.state.roomID;
            console.log("getString: " + getString);


            fetch(getString, {
                method: 'get',
            })
            .then((resp) => resp.json())
            // if success and data was sent back, log the data
            .then((data) => this.roomInit(data) ) //this.setState({room: data}) )
            // if failure, log the error
            .catch((err) => console.log("Error", err));
        }
        else{
            // if the room obj is null, then no room passed in and redirect user to front page
            this.props.history.push("/");
        }

    }

    roomInit = (data) => {
        this.setState({room: data});
        this.setState({hostCode: data.hostCode});
        this.setState({joinCode: data.joinCode});
    }

    resetSlow = () =>{
        this.setState({slowerPeople: 0});
        socket.emit("slowerReset", {name: this.state.id});
    }


    resetYesNo= () =>{
        this.setState({yesCount: 0});
        this.setState({noCount: 0});
        socket.emit("yesNoReset", {name: this.state.id});
    }


    render() {
        // when pass in newly created room from Create.js/Join.js will be in this.props.location.state
        // if we pass props through this.props.history.push
        //console.log("State room: " + this.state.room);
        //if there is a room, change hostCode to the designated hostCode, else it will remain the emtpy strig.

        if (!socket) return null;

        return (
            <div>
                {(this.state.room != null) ?
                    <div>
                        <h3> Host code is: {this.state.room.hostCode} </h3>
                        <h3> User code is: {this.state.room.joinCode} </h3>
                    </div>
                    :
                    <h3> No room FOR TESTING ONLY </h3>

                }



                <SplitPane
                    split="vertical"
                    minSize="90%"
                    maxSize={-200}
                    defaultSize="85%"
                    className="primary"
                >
                    <SplitPane
                        split="horizontal"
                        minSize={200}
                        maxSize={-200}
                        defaultSize="50%"
                    >
                        <div>
                            <Polls isHost= {true} roomId={this.props.location.state.roomID} socket={socket}/>
                        </div>
                        <div>
                            <QContainer />
                        </div>
                    </SplitPane>

                    <div>
                        <SendMail id={this.state.id}/>
                        <br></br>
                        <br></br>
                        <HostCode hostCode={this.state.hostCode} />
                        <JoinCode joinCode={this.state.joinCode} />

                        <h3> Slower Please: {this.state.slowerPeople} </h3>
                        <Button variant="outlined" onClick={this.resetSlow}> Went Slower </Button>
                        <br></br>
                        <br></br>
                        <div class="yesNo">
                            <img src = {yes} width="30" height="30"  alt="Yes" />
                            <h3> : {this.state.yesCount} </h3>
                            <img src = {no} width="30" height="30"  alt="No" />
                            <h3> : {this.state.noCount} </h3>
                        </div>

                        <Button variant="outlined" onClick={this.resetYesNo}> Reset Yes/No </Button>

                        <Resources isHost={true} roomID={this.props.location.state.roomID}/>

                    </div>
                </SplitPane>
            </div>

        )
    }

}

export default Host;
