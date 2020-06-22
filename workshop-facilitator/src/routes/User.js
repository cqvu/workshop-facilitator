import React from "react";
import SplitPane from 'react-split-pane';
import Resources from "../components/Resources";
import QContainer from "../components/QContainer";
import Polls from "../components/Polls";
import io_client from "socket.io-client"
import "../styles/User.css";
import turtle from "../hostUserIcons/TURTLE.png";
import turtleNo from "../hostUserIcons/TURTLENO.png";
import yes from "../hostUserIcons/yesIcon.png";
import yesNo from "../hostUserIcons/yesIconNo.png";
import no from "../hostUserIcons/noIcon.png";
import noNo from "../hostUserIcons/noIconNoNew.png";

let socket;

class User extends React.Component {
    constructor() {
        super();
        this.state = {
            // should be the same as the port you're using for server
            ENDPOINT: "localhost:5000",
            room: null,
            slowerSent: false,
            yesSent: false,
            noSent: false,
            id: ""
        }
    }

    componentDidMount(){
        // make connection between this client and the server (which is active on port 5000)
        socket = io_client(this.state.ENDPOINT);

        socket.on("slowerReset", () =>{
            console.log("host noticed you!");
            this.setState({slowerSent: false});
        })

        socket.on("yesNoReset", () =>{
            console.log("host reset yes/no");
            this.setState({yesSent: false});
            this.setState({noSent: false});
        })

        //get fetches the room by ID if the ID was sent,saves in state
        if(this.props.location.state != null){
             // join the socket room for this workshop room
            const roomID = this.props.location.state.roomID;
            this.setState({id: roomID});
            socket.emit("join", {name: roomID});

            socket.on("welcome", data => console.log("Welcome to Workshop Facilitator"));

            //this.setState( {roomID: this.props.location.state.roomID} );
            //console.log("Here is the ID that was passed: " +  this.state.roomID);
            let getString = "http://localhost:5000/rooms/" + this.props.location.state.roomID;

            fetch(getString, {
                method: 'get',
            })
            .then((resp) => resp.json())
            // if success and data was sent back, log the data
            .then((data) => this.setState({ room: data}) )
            // if failure, log the error
            .catch((err) => console.log("Error", err));

            // make connection between this client and the server (which is active on port 5000)
            //socket = io_client(this.state.ENDPOINT);

            socket.on("slowerReset", () =>{
                console.log("host noticed you!");
                this.setState({slowerSent: false});
            })

            /* if a new user joins, publish the already published question if any
            socket.on("publishNewUser", data => {
                alert(data);
            })*/
        }
        else{
            // no room obj, so redirect user to front page
            this.props.history.push("/");
        }

    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSlower = () => {
        socket.emit("slower", {name: this.state.id});
        this.setState({slowerSent: true});
        console.log("slower sent is:  " + this.state.slowerSent);
        console.log("Here is the state RoomID: " + this.state.id);
    }

    handleYes = () =>{
        socket.emit("yesClick", {name: this.state.id});
        this.setState({yesSent: true});
    }

    handleNo = () =>{
        socket.emit("noClick", {name: this.state.id});
        this.setState({noSent: true});
    }

    render() {
        if (!socket) return null;

        return (
            <div>
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
                        defaultSize="40%"
                    >
                        <div>
                            <Polls isHost={false} socket={socket} roomId={this.props.location.state.roomID}/>
                        </div>
                        <div>
                            <QContainer roomId={this.props.location.state.roomID}/>
                        </div>
                    </SplitPane>
                    <div>

                        {(this.state.room != null) ?
                            <div>
                                <h3> User code is: {this.state.room.joinCode} </h3>
                            </div>
                            :
                            <h3> No room FOR TESTING ONLY </h3>

                        }
                        <div className="slower">
                        {(this.state.yesSent || this.state.noSent) ?
                            (this.state.yesSent === true) ?
                                <img src = {yesNo} width="40" height="40" title="Yes Sent"  alt="disabledYes"/>
                                :
                                <img src = {yesNo} width="40" height="40" title="No Sent"  alt="disabledYes"/>
                            :
                            <img src = {yes} width="40" height="40" title="Yes" onClick={this.handleYes} alt="Yes" />
                        }
                        {(this.state.noSent || this.state.yesSent) ?
                            (this.state.noSent === true) ?
                                <img src = {noNo} width="40" height="40" title="No Sent" alt="disabledNo"/>
                                :
                                <img src = {noNo} width="40" height="40" title="Yes Sent" alt="disabledNo"/>
                            :
                            <img src = {no} width="40" height="40" title="No" onClick={this.handleNo} alt="No" />
                        }
                        {(this.state.slowerSent) ?
                            <img src = {turtleNo} width="40" height="40" title="Slower Message Sent" alt="Turtle No"/>
                            :
                            <img src = {turtle} width="40" height="40" title="Go Slower" onClick={this.handleSlower} alt="TURTLE" />
                        }
                        </div>

                        <Resources roomID={this.props.location.state.roomID}/>
                    </div>
                </SplitPane>
            </div>
        )
    }
}

/*
old slower buttons in case
<Button variant = "outlined" disabled > Message Sent</Button>
 <Button variant = "outlined" onClick={this.handleSlower}> Go Slower </Button>

*/


export default User;
