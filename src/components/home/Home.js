import React, { useEffect } from 'react'
import './Home.scss'
import Navbar from '../navbar/Navbar'
import { AiOutlineHome, AiOutlineSearch } from 'react-icons/ai'
import { BsChatLeftDots, BsHash } from 'react-icons/bs'
import { MdNotificationsActive } from 'react-icons/md'
import { CgProfile } from 'react-icons/cg'
import Feed from '../feed/Feed'
import { useDispatch, useSelector } from 'react-redux'
import { setMenu } from '../../redux/slices/appConfigSlice'
import Chat from '../chat/Chat'
import { Outlet, useNavigate } from 'react-router-dom'
import { getAllPostsOfAUser } from '../../utils/FirebaseServices'
import Notification from '../notification/Notification'

const Home = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const menu = useSelector(state => state.appConfigReducer.menu);
    const myProfile = useSelector(state => state.appConfigReducer.myProfile);

    const changeMenu = (e) => {
        dispatch(setMenu(e.target.innerText));
        if (e.target.innerText == 'Profile') {
            getAllPostsOfAUser(myProfile?.id).then((res) => {
                if (res.status === 'ok') {
                    navigate(`/userProfile`);
                }
            });
        }
        else if (e.target.innerText == 'Chat') {
            navigate(`/chats`);
        }
        else if (e.target.innerText == 'Notification') {
            navigate(`/notifications`);
        }
        else if (e.target.innerText == 'Home') {
            navigate(`/`);
        }
    }

    return (
        <div className='home'>
            <div className="top">
                {/* <div>Home {user?.email}</div> */}
                <Navbar />
            </div>
            <div className="bottom">
                <div className="left">
                    <div className="menu">
                        <div className="heading center">Menu</div>
                        <div className="menu-list">
                            <div className={menu == 'Home' ? 'link selected center' : 'link center'} onClick={changeMenu}>
                                <AiOutlineHome /> Home
                            </div>
                            <div className={menu == 'Search' ? 'link selected center' : 'link center'} onClick={changeMenu}>
                                <AiOutlineSearch /> Search
                            </div>
                            <div className={menu == 'Chat' ? 'link selected center' : 'link center'} onClick={changeMenu}>
                                <BsChatLeftDots /> Chat
                            </div>
                            <div className={menu == 'Notification' ? 'link selected center' : 'link center'} onClick={changeMenu}>
                                <MdNotificationsActive /> Notification
                            </div>
                            <div className={menu == 'Trending' ? 'link selected center' : 'link center'} onClick={changeMenu}>
                                <BsHash /> Trending
                            </div>
                            <div className={menu == 'Profile' ? 'link selected center' : 'link center'} onClick={changeMenu}>
                                <CgProfile /> Profile
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right">
                    {/* <Chat /> */}
                    {/* <Notification/> */}
                    {/* <Feed/> */}
                    <Outlet />
                </div>
            </div>
        </div>

    )
}

export default Home