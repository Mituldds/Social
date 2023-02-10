import { Button, TextField } from '@mui/material'
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { createPost } from '../../utils/FirebaseServices';
import './CreatePost.scss'

const CreatePost = () => {

    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const myProfile = useSelector(state => state.appConfigReducer.myProfile);

    const chooseFile = (e) => {
        setFile(e.target.files[0]);
    }

    const handleSubmit = () => {
        createPost(title, file, myProfile);

        setFile(null);
        setTitle('');
        fileInputRef.current.value = null;
    }

    return (
        <div className='create-post center'>
            <div className="container center">
                <div className="heading">Create a new post</div>

                <TextField value={title} onChange={(e) => setTitle(e.target.value)} size='small' label="Post Title" variant="outlined" />

                <input ref={fileInputRef} className='file center' type='file' onChange={chooseFile} />

                <Button variant='contained' onClick={handleSubmit}>Submit</Button>
            </div>
        </div>
    )
}

export default CreatePost