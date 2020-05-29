import React from 'react';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import SendIcon from '@material-ui/icons/Send';
import DoneIcon from '@material-ui/icons/Done';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import io_client from "socket.io-client";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ChatIcon from '@material-ui/icons/Chat';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import '../styles/Question.css';

let socket;

class Question extends React.Component{
    constructor() {
        super();

        this.state = {
            replies: [],
            replyModal: false,
            anchorEl: null,
            resolved: false,
            currentReply: ''
        }
    }

    componentDidMount() {
        socket = io_client("http://localhost:5000");
    }

    addUpvote = evt => {
        evt.preventDefault();
        // increase upvote count and save to database
        let newUpvoteCount = this.props.question.upvotes + 1;
        console.log(newUpvoteCount);
    }

    openReplyModal = () => {
        this.setState({ replyModal: true})
    }

    closeReplyModal = () => {
        this.setState({ replyModal: false})
    }

    submitReply = (e) => {
        e.preventDefault()
        const { replies } = this.state
        replies.push(this.state.currentReply)
        this.setState({ replies, currentReply: '' })
    }

    handleChangeReply = (e) => {
        this.setState({currentReply: e.target.value})
    }

    handleResolve = () => {
        const qData = this.props.question;
        this.setState({resolved: true})
        socket.emit("qResolve", {qData: qData});
    }

    openMenu = () => {
        this.setState({anchorEl: this.refs.menu})
    }

    handleClose = () => {
        this.setState({anchorEl: null});
    }

    render(){
        return(
            <div className="qContainer">
                <Grid container spacing={1} >
                    <Grid item xs={11}>
                        <p className="qText" >{this.props.question.question}</p>
                    </Grid>
                    <Grid item xs>
                    <IconButton
                        ref="menu"
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={this.openMenu}
                    >
                        <MoreVertIcon fontSize="large"/>
                    </IconButton>
                    <Menu
                        id="long-menu"
                        anchorEl={this.state.anchorEl}
                        open={Boolean(this.state.anchorEl)}
                        onClose={this.handleClose}
                    >
                        <MenuItem onClick={this.openReplyModal}>
                            <ListItemIcon>
                                <ChatIcon />
                            </ListItemIcon>
                            <ListItemText primary="Reply Thread" />
                        </MenuItem>
                        <MenuItem onClick={this.handleResolve}>
                            <ListItemIcon>
                                <DoneIcon />
                            </ListItemIcon>
                            <ListItemText primary="Resolve" />
                        </MenuItem>
                    </Menu>

                    <Dialog
                        fullWidth={true}
                        open={this.state.replyModal}
                        onClose={this.closeReplyModal}
                    >
                        <DialogContent>
                            {this.state.replies.map( reply => 
                                <p>{reply}</p>
                            )}
                            <form noValidate autoComplete="off" onSubmit={this.submitReply}>
                                <InputLabel htmlFor="replyTextField">Reply</InputLabel>
                                <Input
                                    fullWidth={true}
                                    id="replyTextField"
                                    type={'text'}
                                    value={this.state.currentReply}
                                    onChange={this.handleChangeReply}
                                    endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="submitReply"
                                        onClick={this.submitReply}
                                        >
                                            <SendIcon />
                                        </IconButton>
                                    </InputAdornment>
                                    }
                                />
                            </form>
                        </DialogContent>
                    </Dialog>
                        {/* <button className="qBtn" onClick={this.reply} type="button"><ReplyIcon style={{fontSize: '32px'}}/></button>
                        <Popover 
                            className="replyPopover"
                            anchorEl={this.state.anchorEl}
                            open={Boolean(this.state.anchorEl)}
                            onClose={this.handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            >
                            <TextareaAutosize aria-label="empty textarea" placeholder="Reply" className="replyText" ref="replyText"/>

                            <button type="button" onClick={this.submitReply} className="submitReplyBtn">Reply</button>
                        </Popover>
                        <button className="qBtn" onClick={this.handleResolve} type="button"><DoneIcon style={{fontSize: '32px'}}/></button> */}
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default Question;