import React, { useEffect, useState } from 'react'
import { Routes, Route } from "react-router-dom";
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import Home from './components/home/Home'
import RequiredUser from './RequiredUser'
import OnlyIfNotLoggedIn from './OnlyIfNotLoggedIn'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { setMyProfile } from './redux/slices/appConfigSlice';
import { getMyDoc } from './utils/FirebaseServices';
import { useDispatch } from 'react-redux';
import CreatePost from './components/createPost/CreatePost';
import UserProfile from './components/userProfile/UserProfile';

const App = () => {

    const [user, setUser] = useState({});

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            console.log(currentUser);

            if (currentUser) {
                getMyDoc(currentUser.uid);
            }
        })

        return () => unsubscribe();
    }, [])

    return (
        <div>
            <Routes>

                <Route element={<RequiredUser user={user} />}>
                    <Route path='/' element={<Home />} />
                    {/* <Route path='/createPost' element={<CreatePost />} /> */}
                    <Route path='/userProfile' element={<UserProfile />} />
                </Route>


                <Route element={<OnlyIfNotLoggedIn user={user} />}>
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/login' element={<Login />} />
                </Route>
            </Routes>
        </div>
    )
}

export default App