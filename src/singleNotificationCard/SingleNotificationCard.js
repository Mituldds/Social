import React from 'react'
import Avatar from '../components/avatar/Avatar'
import './SingleNotificationCard.scss'
import dummy_post_img from '../assets/dummy-post.png'
import ta from 'time-ago'

const SingleNotificationCard = ({ notification }) => {
    return (
        <div className='single-notification-card'>
            <div className="notification-card-left center">
                <Avatar width={'40px'} height={'40px'} src={notification?.senderPhotoUrl} id={notification?.senderId} />
            </div>
            <div className="notification-card-content">
                <div className="title">{`${notification?.senderName} ${notification?.message}`}</div>
                <div className="post-title">{notification?.postTitle}</div>
                <div className="notification-time">{ta.ago(new Date(notification.createdAt))}</div>
            </div>
            {
                notification?.postUrl && <div className="notification-card-right center">
                    <img src={notification?.postUrl} alt="" className='post-img' />
                </div>
            }

        </div>
    )
}

export default SingleNotificationCard