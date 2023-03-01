import React, { useEffect, useState } from 'react'
import './UserProfile.scss'
import { AiOutlineRollback } from 'react-icons/ai'
import { Button, Box, Modal } from '@mui/material'
import { FiEdit } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedPostType } from '../../redux/slices/userProfileSlice'
import { userFollowUnFollow } from '../../utils/FirebaseServices'
import UpdateProfile from '../updateProfile/UpdateProfile'
import dummy from '../../assets/user.png'
import { setMenu } from '../../redux/slices/appConfigSlice'
import { sortAllMessages } from '../../redux/slices/chatSlice'

const UserProfile = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userProfile = useSelector(state => state.userProfileReducer.userProfile);
    const myProfile = useSelector(state => state.appConfigReducer.myProfile);
    const filteredPosts = useSelector(state => state.userProfileReducer.filteredPosts);
    const selectedPostType = useSelector(state => state.userProfileReducer.selectedPostType);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    useEffect(() => {
        if (!userProfile) {
            navigate('/');
        }
    }, [])

    const handleClick = (type) => {
        dispatch(setSelectedPostType(type))
    }

    const backToHome = () => {
        dispatch(setMenu('Home'));
        navigate('/');
    }

    return (
        <div className='user-profile'>
            <div className="cover-photo">
                <img width='100px' src={userProfile?.photoUrl || dummy } alt="" />
                <button className='center' onClick={backToHome}><AiOutlineRollback className='back-icon' /> &nbsp; Back to home</button>
            </div>
            <div className="user-info">
                <div className="left">
                    <pre>
                        <span>Name:</span> {userProfile?.name} <br />
                        <span>Email:</span> {userProfile?.email} <br />
                        <span>Phone:</span> {userProfile?.phone}
                    </pre>
                </div>
                <div className="right">
                    {
                        userProfile?.id == myProfile?.id ?
                            <Button onClick={handleOpen} className='edit-btn center' variant='contained' size='small' startIcon={<FiEdit />}>Edit</Button> :
                            <Button size='small' onClick={() => userFollowUnFollow(userProfile.id, myProfile.id)} variant='outlined'>
                                {
                                    myProfile?.followings?.includes(userProfile?.id) ? 'Unfollow' : 'Follow'
                                }
                            </Button>
                    }
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <UpdateProfile setOpen={setOpen}/>
                        </Box>
                    </Modal>
                </div>
            </div>
            <div className="user-posts center">
                <div className="post-container">
                    <div className="header">
                        <button onClick={() => handleClick('Photos')} className={selectedPostType == 'Photos' ? 'selected' : ''}>Photos</button>
                        <button onClick={() => handleClick('Videos')} className={selectedPostType == 'Videos' ? 'selected' : ''}>Videos</button>
                    </div>
                    <div className="content">
                        {
                            filteredPosts?.map((post) => <img key={post?.id} src={post?.postUrl} alt="" />)
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile