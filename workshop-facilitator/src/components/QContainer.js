import React from "react";
import io_client from "socket.io-client";
import '../styles/Questions.css';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Questions from './Questions';
import Resolved from './Resolved';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

let socket;

class QContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            question: "",
            questions: [],
            curID: 1,
            ENDPOINT: "localhost:5000",
            activeTab: 0
        }
    }

    componentDidMount() {
        socket = io_client(this.state.ENDPOINT);
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleChangeTab = (e, value) => {
        this.setState({
            activeTab: value
        })
    }

    postQuestion = (e) => {
        e.preventDefault();
        const {roomId} = this.props;
        const newQst = this.state.question;

        if (newQst) {
            let questionData = {question : newQst, replies: [], resolved: false}

            // join the socket room with the given room
            socket.emit("join", {name: roomId});

            fetch(`http://localhost:5000/rooms/${roomId}/questions/add`, {
                // send as a POST request with new room information in body,
                //POST fetch("the API route that adds a new question, {method: "POST", body:
                //{question data to pass in}})
                method: 'post',
                headers: {"Content-Type" : "application/json"}, //have to specify content type as json, or else server thinks its something else;
                body: JSON.stringify(questionData)
            })
            //using .text() instead of .json to avoid errors
            .then((resp) => resp.json())
            // if success and data was sent back, log the data
            .then((question) => {
                console.log("Success added question ", question)
                socket.emit("question", question);
            })
            // if failure, log the error
            .catch((err) => console.log("Error", err));
        }
        // clear chatbox
        this.setState({question: ""})
    }

    render() {
        return (
            <div className="qListContainer">
                <AppBar position="static" color="default">
                <Tabs value={this.state.activeTab} onChange={this.handleChangeTab} centered indicatorColor="primary" textColor="primary">
                    <Tab label="Questions"/>
                    <Tab label="Resolved"/>
                </Tabs>
                </AppBar>

                {this.state.activeTab === 0 && 
                    <TabContainer>
                        <Questions roomId={this.props.roomId}/>
                    </TabContainer>
                }
                {this.state.activeTab === 1 &&
                    <TabContainer>
                        <Resolved roomId={this.props.roomId}/>
                    </TabContainer>
                }

                <form noValidate autoComplete="off" onSubmit = {this.postQuestion} onChange = {this.handleChange}>
                    <Grid container>
                    <TextField id="question" fullWidth label="Enter a Question" variant="outlined">Enter Question</TextField>
                    <Button type="submit" >&gt;</Button>
                    </Grid>
                </form>

            </div>
        )
    }
}

function TabContainer(props) {
    return (props.children);
}

export default QContainer;
