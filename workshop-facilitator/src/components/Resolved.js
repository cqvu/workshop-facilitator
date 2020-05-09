import React from "react";
import Question from './Question';
import io_client from "socket.io-client";
import '../styles/Questions.css';
import { Scrollbars } from 'react-custom-scrollbars';

let socket;

class Resolved extends React.Component {
    constructor() {
        super();
        this.state = {
            questions: [],
            curID: 1,
            ENDPOINT: "localhost:5000",
            activeTab: 1
        }
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
                    : <p>No resolved questions to display</p>
                }
            </div>
            </Scrollbars>

        )
    }
}

export default Resolved;
