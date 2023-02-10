import React, { useState } from 'react'
import './Login.scss'
import { Button, TextField } from '@mui/material';
import { BsFacebook, BsGoogle, BsTwitter } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom';
import { auth, resetPassword, signInWithFacebook, signInWithGoogle } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {

    const navigate = useNavigate();

    const [info, setInfo] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setInfo({ ...info, [name]: value });
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        try {

            const { email, password } = info;

            if (!email || !password) {
                alert('All fields are required');
                return;
            }

            const user = await signInWithEmailAndPassword(auth, email, password);
            console.log(user);
            navigate('/');

        } catch (error) {
            console.log(error);
            alert('Invalid Credientials');
        }
    }

    const forgotPassword = () => {
        if(!info.email) {
            alert('Plz provide your registerd email Id');
            return;
        }

        resetPassword(info.email);
    }

    const google = () => {
        signInWithGoogle().then((res) => {
            if(res.status == 'ok'){
                navigate('/');
            }
            else{
                alert('Something went wrong');
            }
        })
    }

    const facebook = () => {
        signInWithFacebook().then((res) => {
            if(res.status == 'ok'){
                navigate('/');
            }
            else{
                alert('Something went wrong');
            }
        })
    }

    return (
        <div className='login'>
            <div className="container">
                <div className="heading center">
                    <span>Login</span>
                </div>
                <div className="form">
                    <form onSubmit={handleLogin}>
                        <TextField name='email' label="Enter Email" variant="outlined" onChange={handleChange} />
                        <TextField name='password' type='password' label="Enter Password" variant="outlined" onChange={handleChange} />
                        <Button variant="contained" type='submit'>
                            Login
                        </Button>
                    </form>

                    <div className="forgot-password">
                        <span className='first'>Don't have account? <Link className='link' to='/signup'>Signup</Link></span>
                        <span onClick={() => forgotPassword()} className='second'>Forgot Password</span>
                    </div>

                    <div className="other-btn center">
                        <Button variant="contained" onClick={facebook} className='btn facebook '>Login with &nbsp; <BsFacebook /></Button>

                        {/* <Button variant="contained" className='btn twitter '>Login with &nbsp; <BsTwitter /></Button> */}

                        <Button variant="contained" onClick={google} className='center btn google '>Login with &nbsp; <BsGoogle /></Button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Login