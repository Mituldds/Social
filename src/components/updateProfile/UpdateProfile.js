import { TextField, Button } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { updateUserProfile } from '../../utils/FirebaseServices';
import './UpdateProfile.scss'

const UpdateProfile = ({ setOpen }) => {

    const myProfile = useSelector(state => state.appConfigReducer.myProfile);
    const [newInfo, setNewInfo] = useState({
        newName: '',
        newPhone: ''
    })
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setNewInfo({ newName: myProfile?.name, newPhone: myProfile?.phone });
    }, [])

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setNewInfo({ ...newInfo, [name]: value });
    }

    const chooseFile = (e) => {
        setFile(e.target.files[0]);
    }

    const handleUpdate = (e) => {
        e.preventDefault();
        if(!newInfo.newName || !newInfo.newPhone){
            alert("Name and Phone no. is required");
            return;
        }

        updateUserProfile(file, myProfile.id, newInfo).then((res) => {
            if (res.status == 'ok') {
                setOpen(false);
            }
        })

        setFile(null);
        fileInputRef.current.value = null;
    }

    return (
        <div className='update-profile'>
            <div className="container">
                <div className="heading center">
                    <span>Update Profile</span>
                </div>
                <div className="form">
                    <form onSubmit={handleUpdate}>
                        <TextField size='small' name='newName' value={newInfo.newName} label="Enter new name" variant="outlined" onChange={handleChange} />
                        <TextField size='small' name='newPhone' type='number' value={newInfo.newPhone} label="Enter new phone no." variant="outlined" onChange={handleChange} />
                        <input ref={fileInputRef} className='file center' type='file' onChange={chooseFile} />
                        <Button variant="contained" type='submit'>
                            Update
                        </Button>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default UpdateProfile