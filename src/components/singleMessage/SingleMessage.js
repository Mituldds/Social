import { Box, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx';
import { useSelector } from 'react-redux';
import { deleteMessage } from '../../utils/FirebaseServices';
import Showfile from '../showFile/Showfile';
import './SingleMessage.scss'

const SingleMessage = ({ msg }) => {

    const [date, setDate] = useState([]);

    const myProfile = useSelector(state => state.appConfigReducer.myProfile);
    const chatId = useSelector(state => state.chatReducer.chatId);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [showDeleteIcon, setShowDeleteIcon] = useState(false);

    useEffect(() => {
        setDate(new Date(msg?.createdAt).toUTCString().split(" ").splice(0, 4))
    }, []);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
    };

    const imgClick = (e) => {
        e.stopPropagation();
        handleOpen();
        setShowDeleteIcon(false);
    }

    const handleRightClick = (e) => {
        e.preventDefault();
        // alert('right clicked');
        if (!showDeleteIcon) {
            if (msg?.senderId == myProfile?.id) {
                setShowDeleteIcon(true);
            }
            else {
                setShowDeleteIcon(false);
            }
        }
        else {
            setShowDeleteIcon(false);
        }
    }

    const removeMsg = () => {
        if (window.confirm('Are you sure you want to delete the message')) {
            deleteMessage(msg, chatId).then((res) => {
                if (res.status == 'error') {
                    alert(res.message);
                }
                else {
                    // alert(res.result);
                }
            })
        }

    }

    return (
        <div className={`single-message ${msg?.senderId === myProfile?.id ? 'end' : 'start'}`} onClick={() => setShowDeleteIcon(false)}>
            <span className={`msg center ${msg?.senderId === myProfile?.id ? 'blue' : 'green'}`} onContextMenu={handleRightClick}>
                {
                    msg?.fileType === 'image' && <img onClick={imgClick} className='chat-img' src={msg?.fileUrl} alt="" />
                }

                {msg?.text}
                <span className='time'>{`${date[0]} ${date[1]} ${date[2]} ${date[3]}`}</span>
                {
                    showDeleteIcon && <div className="deleteChat-icon center" onClick={removeMsg}>
                        <RxCross2 />
                    </div>
                }

            </span>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Showfile src={msg?.fileUrl} />
                </Box>
            </Modal>
        </div>
    )
}

export default SingleMessage