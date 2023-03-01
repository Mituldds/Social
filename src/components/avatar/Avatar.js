import React from 'react'
import './Avatar.scss'
import defaultAvatar from '../../assets/user.png'
import { useNavigate } from 'react-router-dom'
import { getAllPostsOfAUser } from '../../utils/FirebaseServices'

const Avatar = ({ src, id, width, height }) => {

    const navigate = useNavigate();

    const handleClick = (e) => {
        e.stopPropagation();
        if(!id) return;
        
        getAllPostsOfAUser(id).then((res) => {
            if(res.status === 'ok'){
                navigate(`/userProfile`);
            }
        });
    }

    return (
        <div className='Avatar' onClick={handleClick}>
            <img width={width} height={height} src={src ? src : defaultAvatar} alt="user avatar" />
        </div>
    )
}

export default Avatar