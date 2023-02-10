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

const Home = () => {

    const dispatch = useDispatch();
    const menu = useSelector(state => state.appConfigReducer.menu);

    const changeMenu = (e) => {
        dispatch(setMenu(e.target.innerText));
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
                    <Feed />
                </div>
            </div>
        </div>

    )
}

export default Home