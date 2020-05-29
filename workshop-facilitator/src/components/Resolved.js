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
            resolved: [],
            curID: 1,
            ENDPOINT: "localhost:5000",
            activeTab: 1
        }
    }

    componentDidMount() {
        socket = io_client("http://localhost:5000");

        socket.on("qResolve", data => {
            console.log('got socket for resolve')
            const { resolved } = this.state
            resolved.push(data.qData)
            this.setState({ resolved })
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
                    this.state.resolved && this.state.resolved.length > 0 ?
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
