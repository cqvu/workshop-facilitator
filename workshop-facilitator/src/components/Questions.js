import React from "react";
import Question from './Question';
import io_client from "socket.io-client";
import '../styles/Questions.css';
import { Scrollbars } from 'react-custom-scrollbars';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

let socket;

class Questions extends React.Component {
    constructor() {
        super();
        this.state = {
            questions: [{
                id: 0,
                question: "Test question",
                upvotes: 0
            }],
            curID: 1,
            ENDPOINT: "localhost:5000",
            activeTab: 1
        }
    }

    componentDidMount(){
        socket = io_client(this.state.ENDPOINT);

        // listen for when the server sends a new question that some client sent
        socket.on("question", data => {
          // update the questions to include the new question
          this.setState(prevState => {
            const questions = prevState.questions.push({id:this.state.curID, question:data.question, upvotes:0});
            return questions;
          })
        })  
        this.setState({
            curID: this.state.curID + 1
        })
    }

    handleChange = (e, value) => {
        this.setState({
            activeTab: value
        })
    }

    render() {
        return (
            <Scrollbars style={{height: "50vh", width: "85vw"}}>
            <div className="qListContainer">
                {
                    this.state.questions && this.state.questions.length > 0 ?
                        this.state.questions.map(question =>
                            <Question key={question.id} question={question} />
                        )
                    : null
                }
            </div>
            </Scrollbars>

        )
    }
}

export default Questions;
