import React from "react";
import Question from './Question';
import io_client from "socket.io-client";
import '../styles/Questions.css';
import { Scrollbars } from 'react-custom-scrollbars';

let socket;

class Questions extends React.Component {
    constructor() {
        super();
        this.state = {
            questions: [],
            ENDPOINT: "localhost:5000",
            activeTab: 1
        }
    }

    componentDidMount(){
        const {roomId} = this.props;
        // fetch resources from database and populate this.state.resources
        fetch(`http://localhost:5000/rooms/${roomId}/questions`)
            .then(res => res.json())
            .then(questions => {
                questions = questions.filter(question => question.resolved === false);
                this.setState({questions});
            });

        socket = io_client(this.state.ENDPOINT);

        // listen for when the server sends a new question that some client sent
        socket.on("question", question => {
            console.log("socket for adding question ", question)
          // update the questions to include the new question
          this.setState(prevState => {
            const questions = prevState.questions.push(question);
            return questions;
          })
        })  
    }

    handleChange = (e, value) => {
        this.setState({
            activeTab: value
        })
    }

    handleResolve = (questionId) => {
        const {roomId} = this.props;
        console.log("resolving: ", roomId, questionId)
        fetch(`http://localhost:5000/rooms/${roomId}/questions/${questionId}/resolve`, {
            method: "POST",
            headers: {"Content-Type": "application/json"}
        })
            .then(resp => resp.json())
            .then(questions => {
                questions = questions.filter(question => question.resolved === false);
                console.log(questions)
                this.setState({questions})
            });
        //socket.emit("qResolve", {qData: qData});
    }

    render() {
        return (
            <Scrollbars style={{height: "50vh", width: "85vw"}}>
            <div className="qListContainer">
                {
                    this.state.questions && this.state.questions.length > 0 ?
                        this.state.questions.map(question =>
                            <Question key={question._id} question={question} handleResolve={this.handleResolve}/>
                        )
                    : null
                }
            </div>
            </Scrollbars>

        )
    }
}

export default Questions;
