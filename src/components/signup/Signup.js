import React, { useState } from 'react'
import './Signup.scss'
import { Button, TextField } from '@mui/material';
import { BsFacebook, BsGoogle, BsTwitter } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom';
import { signInWithFacebook, signInWithGoogle } from '../../firebaseConfig';
import { signupWithEmailAndPassword } from '../../utils/FirebaseServices';

const Signup = () => {

    const navigate = useNavigate();

    const [info, setInfo] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        cpassword: ''
    })

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setInfo({ ...info, [name]: value });
    }

    const handleSignup = async (e) => {
        e.preventDefault();

        try {

            const { name, email, phone, password, cpassword } = info;

            if (!name || !email || !phone || !password || !cpassword) {
                alert('All fields are required');
                return;
            }

            if (password != cpassword) {
                alert("Plz confirm your password");
                return;
            }

            const response = await signupWithEmailAndPassword(info);
            console.log(response);

            if (response.status == 'error') {
                alert('User already exists');
                return;
            }

            alert('user registered');
            navigate('/login');
            return;

        } catch (error) {
            console.log(error);
            alert('User already exists');
        }
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
        <div className='Signup'>
            <div className="container">
                <div className="heading center">
                    <span>Signup</span>
                </div>
                <div className="form">
                    <form onSubmit={handleSignup}>
                        <TextField name='name' size='small' className='input' label="Enter Name" variant="outlined" onChange={handleChange} />
                        <TextField name='email' size='small' className='input' label="Enter Email" variant="outlined" onChange={handleChange} />
                        <TextField name='phone' size='small' className='input' type='number' label="Enter Phone" variant="outlined" onChange={handleChange} />
                        <TextField name='password' size='small' className='input' type='password' label="Enter Password" variant="outlined" onChange={handleChange} />
                        <TextField name='cpassword' size='small' className='input' type='password' label="Confirm Password" variant="outlined" onChange={handleChange} />
                        <Button variant="contained" type='submit'>
                            Sign Up
                        </Button>
                    </form>

                    <div className="forgot-password">
                        Have already an Account? <Link className='link' to="/login">Login</Link>
                    </div>

                    <div className="other-btn center">
                        <Button variant="contained" onClick={facebook} className='btn facebook center '>Login with &nbsp; <BsFacebook /></Button>

                        {/* <Button variant="contained" className='btn twitter center '>Login with &nbsp; <BsTwitter /></Button> */}

                        <Button variant="contained" onClick={google} className='btn google center'>Login with &nbsp; <BsGoogle /></Button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Signup