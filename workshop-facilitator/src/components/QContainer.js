import React from "react";
import io_client from "socket.io-client";
import '../styles/Questions.css';
import { Scrollbars } from 'react-custom-scrollbars';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Questions from './Questions';
import Resolved from './Resolved';

let socket;

class QContainer extends React.Component {
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
            <div className="qListContainer">
                <AppBar position="static" color="default">
                <Tabs value={this.state.activeTab} onChange={this.handleChange} centered indicatorColor="primary" textColor="primary">
                    <Tab label="Unanswered"/>
                    <Tab label="Resolved"/>
                </Tabs>
                </AppBar>

                {this.state.activeTab === 0 && 
                    <TabContainer>
                        <Questions />
                    </TabContainer>
                }
                {this.state.activeTab === 1 &&
                    <TabContainer>
                        <Resolved />
                    </TabContainer>
                }

            </div>

        )
    }
}

function TabContainer(props) {
    return (props.children);
}

export default QContainer;
