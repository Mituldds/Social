import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMenu } from '../../redux/slices/appConfigSlice'
import { setNotificationMenu } from '../../redux/slices/notificationSlice'
import SingleNotificationCard from '../../singleNotificationCard/SingleNotificationCard'
import './Notification.scss'

const Notification = () => {

    const allNotifications = useSelector(state => state.notificationReducer.allNotifications);
    const notificationMenu = useSelector(state => state.notificationReducer.notificationMenu);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setMenu('Notification'));
    }, [])

    return (
        <div className='notification'>
            <div className="notification-heading">
                <div className="main-heading">
                    Notification
                </div>
                <div className="btn">
                    <button className={notificationMenu == 'New' ? 'selected' : ''} onClick={() => dispatch(setNotificationMenu('New'))}>
                        New
                    </button>
                    <button className={notificationMenu == 'All' ? 'selected' : ''} onClick={() => dispatch(setNotificationMenu('All'))}>
                        All
                    </button>
                </div>
            </div>
            <div className="notification-content">

                {
                    allNotifications?.map((notification) => <SingleNotificationCard key={notification?.id} notification={notification} />)
                }

            </div>
        </div>
    )
}

export default Notification