import { doc, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { db } from '../../firebaseConfig'
import { setCurrentChatUser } from '../../redux/slices/chatSlice'
import { getChatId } from '../../utils/FirebaseServices'
import Avatar from '../avatar/Avatar'
import './UserCard.scss'

const UserCard = ({ user }) => {

    const myProfile = useSelector(state => state.appConfigReducer.myProfile);
    const allMessages = useSelector(state => state.chatReducer.allMessages);
    const dispatch = useDispatch();
    const [lastMessage, setLastMessage] = useState('---');

    // useEffect(() => {

    //     const unsubscribe = onSnapshot(doc(db, `users/${user?.id}/lastMessage`, myProfile?.id), (doc) => {
    //         const lastMessageChat = { ...doc.data(), id: doc.id };
    //         // console.log("Current data: ", doc.data());
    //         if (lastMessageChat != undefined && !lastMessageChat.fileType) {
    //             let lastMSGText = lastMessageChat.text;
    //             if (lastMSGText.length > 30) {
    //                 lastMSGText = lastMSGText.slice(0, 30) + "...";
    //             }
    //             setLastMessage(lastMSGText);
    //         }
    //         else if (lastMessageChat != undefined && lastMessageChat.fileType) {
    //             setLastMessage(lastMessageChat.fileType);
    //         }
    //     });

    //     return () => unsubscribe();
    // }, [myProfile])

    // useEffect(() => {
    //     for (let i = allMessages?.length - 1; i >= 0; i--) {
    //         if (allMessages[i].senderId == user?.id) {
    //             if (!allMessages[i].fileType) {
    //                 let lastMSGText = allMessages[i].text;
    //                 if (lastMSGText.length > 30) {
    //                     lastMSGText = lastMSGText.slice(0, 30) + "...";
    //                 }
    //                 setLastMessage(lastMSGText);
    //             }
    //             else if (allMessages[i].fileType == 'image') {
    //                 setLastMessage("Photo");
    //             }
    //             else if (allMessages[i].fileType == 'video') {
    //                 setLastMessage("Video");
    //             }
    //             break;
    //         }
    //     }
    // }, [allMessages])

    const handleClick = () => {
        getChatId(user?.id, myProfile?.id);
        dispatch(setCurrentChatUser(user));
    }

    return (
        <div className='user-card' onClick={handleClick}>
            <div className="user-logo center">
                <Avatar src={user?.photoUrl} id={user?.id} width='30px' height='30px' />
            </div>
            <div className="user-card-info">
                <div className="top-msg">
                    {
                        user?.name
                    }
                </div>
                <div className="bottom-msg">
                    {
                        lastMessage
                    }
                </div>
            </div>
        </div>
    )
}

export default UserCard