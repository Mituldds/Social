import React, { useState } from 'react'
import './Navbar.scss'
import logo from '../../assets/image 2.png'
import { Button, Box, Modal } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useSelector } from 'react-redux';
import CreatePost from '../createPost/CreatePost';
import Avatar from '../avatar/Avatar';

const Navbar = () => {

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const myProfile = useSelector(state => state.appConfigReducer.myProfile);

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

    const logout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <>
            <div className='navbar'>
                <div className="left center">
                    <div className="logo">
                        <img src={logo} alt="Logo" />
                    </div>
                    <div className="heading">
                        <h1>Growth</h1>
                        <h6>Swap tips for finding users and customers.</h6>
                    </div>
                </div>
                <div className="right center">
                    {/* <img width='50px' height='50px' src={myProfile.photoUrl ? myProfile.photoUrl : defaultAvatar}></img> */}
                    <Avatar width={'50px'} height={'50px'} src={myProfile.photoUrl} id={myProfile.id} />
                    <Button size='small' variant='outlined' color='primary' onClick={logout}>Logout</Button>
                </div>
            </div>
            <div className="new-post">
                <Button onClick={handleOpen} className='btn' size='small' variant='contained'>New Post</Button>
                <Button className='btn' size='small' variant='contained'>Join Group</Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    {/* <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Text in a modal
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                        </Typography>
                    </Box> */}

                    <Box sx={style}>
                        <CreatePost />
                    </Box>
                </Modal>
            </div>
        </>
    )
}

export default Navbar