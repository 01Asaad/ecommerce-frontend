import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserProvider';

export default function Signup() {
    const navigateTo = useNavigate()
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { isLoggedIn, user, setUser } = useUser()


    const validateInputs = () => {
        if (!email || !password || !username || !firstName || !lastName) {
            setError('Please fill all fields.');
            return false;
        }
        setError('');
        return true;
    };
    const handleSignup = async () => {
        if (!validateInputs()) return;

        try {
            const response = await axios.post('http://localhost:3001/api/auth/signup', { email, password, username, firstName, lastName });
            console.log('Signup successful:', response.data);
            setUser(response.data.userInfo)
            navigateTo("/")

        } catch (error) {
            console.error('Signup failed:', error);
            setError(error.response.data.message);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleSignup();
    };

    return (
        <div className='flex w-screen h-screen dark:bg-gray-800'>
            <div className='w-1/2 bg-blue-400'></div>
            <div className="w-1/2 flex flex-col justify-center items-center">
                <div className='w-1/2 h-screen flex flex-col justify-center items-center'>
                    <div className="text-blue-400 mb-10">
                        <h1 className='text-5xl text-center'>E-commerce</h1>
                        <p className='text-black dark:text-white text-center'>Let's trade</p>
                    </div>
                    <form className="flex flex-col justify-center items-center w-full" onSubmit={handleSubmit}>
                        <input
                            className="tinput"
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <input
                            className="tinput"
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <input
                            className="tinput"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="tinput"
                            type="text"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            className="tinput"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <p className='text-red-600'>{error}</p>}
                        <button
                            className="mt-10 w-full bg-blue-400 transition duration-100 hover:bg-blue-700 text-white rounded-md p-3 m-4"
                            type="submit"
                        >
                            Signup
                        </button>
                    </form>
                    <div className='absolute bottom-0 mb-2'>
                        <label className='text-gray-400 text-center'>Already have an account? </label>
                        <a className="anchor" href='/login'>Login</a>

                    </div>
                </div>
            </div>
        </div>
    );
}
