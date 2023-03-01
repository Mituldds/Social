import { Button, TextField } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import Avatar from '../avatar/Avatar'
import './Chat.scss'
import { BiSend } from 'react-icons/bi'
import UserCard from '../userCard/UserCard'
import { BsFillCameraVideoFill, BsThreeDots } from 'react-icons/bs'
import { MdCall } from 'react-icons/md'
import SingleMessage from '../singleMessage/SingleMessage'
import { addMessage, getAllUsers, getChatId } from '../../utils/FirebaseServices'
import { useDispatch, useSelector } from 'react-redux'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import { setAllMessages, setUserToShow } from '../../redux/slices/chatSlice'
import ReactScrollToBottom from 'react-scroll-to-bottom'
import { AiOutlineFileAdd } from 'react-icons/ai'
import { RxCross2 } from 'react-icons/rx'
import { setMenu } from '../../redux/slices/appConfigSlice'

const Chat = () => {

    const dispatch = useDispatch();

    const myProfile = useSelector(state => state.appConfigReducer.myProfile);
    const userToShow = useSelector(state => state.chatReducer.userToShow);
    const chatId = useSelector(state => state.chatReducer.chatId);
    const currChatUser = useSelector(state => state.chatReducer.currChatUser);
    const allMessages = useSelector(state => state.chatReducer.allMessages);

    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (myProfile?.email == undefined) return;
        getAllUsers(myProfile?.email);
    }, [myProfile])

    useEffect(() => {
        getChatId(currChatUser?.id, myProfile?.id);
    }, [currChatUser])

    useEffect(() => {
        dispatch(setMenu('Chat'));
    }, [])

    useEffect(() => {
        let unsub = () => { }
        if (chatId) {
            const conversationsRef = collection(db, `chats/${chatId}/conversations`);
            const querMessages = query(conversationsRef, orderBy('createdAt'));
            // const temp = [];
            unsub = onSnapshot(querMessages, (snapshot) => {

                // console.log(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))

                // snapshot.forEach((doc) => {
                //     temp.push({ ...doc.data(), id: doc.id });
                // })

                // dispatch(setAllMessages(temp));
                dispatch(setAllMessages(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))));
                // console.log("new msg");
            })
        }
        return () => unsub();
    }, [chatId])

    const chooseFile = (e) => {
        setFile(e.target.files[0]);
    }

    const sendMessage = (e) => {
        e.preventDefault();
        if (!text && !file) return;

        addMessage(chatId, currChatUser?.id, myProfile?.id, text, file).then((res) => {
            if (res.status === 'ok') {
                setText('');
            }
            else {
                alert(res.message);
            }

            setFile(null);
            fileInputRef.current.value = null;
        });
    }

    const removeFile = () => {
        setFile(null);
        fileInputRef.current.value = null;
    }

    const searchPeopleForChat = (e) => {
        dispatch(setUserToShow(e.target.value));
    }

    return (
        <div className='chat'>
            <div className="sidebar">
                <div className="sidebar-heading center">
                    <input type="text" placeholder='Search People' className='sidebar-search' onChange={searchPeopleForChat}/>
                </div>
                <div className="people-list">
                    {
                        userToShow?.map((user) => <UserCard key={user?.id} user={user} />)
                    }
                </div>
            </div>


            <div className="chat-content">
                <div className="chat-header">
                    <div className="person-name">
                        <Avatar src={currChatUser?.photoUrl} id={currChatUser?.id} width='40px' height='40px' />
                        <span>{currChatUser?.name}</span>
                    </div>
                    <div className="other-options">
                        <div className="video-call">
                            <BsFillCameraVideoFill className='chat-icons' />
                        </div>
                        <div className="phone-call">
                            <MdCall className='chat-icons' />
                        </div>
                        <div className="other">
                            <BsThreeDots className='chat-icons' />
                        </div>
                    </div>
                </div>
                {
                    allMessages.length === 0 ?
                        <div className='no-msg center'>No Messages</div> :
                        <ReactScrollToBottom className="messages">
                            {
                                allMessages?.map((msg) => <SingleMessage key={msg?.id} msg={msg} />)
                            }
                        </ReactScrollToBottom>
                }

                <div className="send-message">
                    <form className='center' onSubmit={sendMessage}>
                        <TextField value={text} onChange={(e) => setText(e.target.value)} className='msg-input' size='small' label='Type here...' />
                        <label htmlFor="file" title={file ? file.name : "No file"}>{<AiOutlineFileAdd className='add-file-icon' />}</label>
                        <input ref={fileInputRef} className='add-file' type="file" id='file' onChange={chooseFile} />
                        <Button size='medium' type='submit' variant='contained' className='send-chat-btn' endIcon={<BiSend />}>Send</Button>
                    </form>

                    {
                        file && <div className="show-file-name center">
                            {
                                file?.name
                            }
                            <div className="small-box"></div>
                            <div className="remove center" onClick={removeFile}>
                                <RxCross2 />
                            </div>
                        </div>
                    }


                </div>
            </div>

        </div>
    )
}

export default Chat