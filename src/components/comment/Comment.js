import React, { useEffect, useState } from 'react'
import Avatar from '../avatar/Avatar'
import './Comment.scss'
import ta from 'time-ago'
import { getAParticularUser } from '../../utils/FirebaseServices'

const Comment = ({ comment }) => {

    const [user, setUser] = useState();

    useEffect(() => {
        getAParticularUser(comment?.ownerId, setUser);
    }, []);

    return (
        <div className='comment center'>
            <div className="avatar">
                <Avatar width={'30px'} height={'30px'} src={user?.photoUrl} id={comment?.ownerId} />
            </div>
            <div className="msg">
                <div className="text">
                    {comment?.message}
                </div>
                <div className="time-stamp">
                    {
                        ta.ago(comment?.createdAt)
                    }
                </div>
            </div>
        </div>
    )
}

export default Comment