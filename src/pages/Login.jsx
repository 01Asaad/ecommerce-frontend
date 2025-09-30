import React, { useState, useRef, useEffect, useReducer } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams, Link, useFetcher } from 'react-router-dom';
import { useUser } from "../context/UserProvider"

const validateInputs = (identifier, password) => {
    if (!identifier || !password) {
        return 'Please enter both email and password.';
    }
    return '';
};

export async function action({ request, params }) {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');
    
    const currentError = validateInputs(email, password);
    if (currentError) {
        console.log("validation error: " + currentError);
        return { error: currentError };
    }

    try {
        const response = await axios.post('http://localhost:3001/api/auth/login', { 
            identifier: email, 
            password: password 
        });
        return { user: response.data, success: true };
    } catch (errorThrowback) {
        console.error('Login failed:', errorThrowback.message);
        return { 
            error: errorThrowback.response?.data?.message || errorThrowback.message 
        };
    }
}
export default function Login() {
    const navigateTo = useNavigate()
    const fetcher = useFetcher()
    const [searchParams, setSearchParams] = useSearchParams()
    const { isLoading, isLoggedIn, user, setUserInfo } = useUser()
    const [error, setError] = useState('');

    useEffect(() => {
        if (fetcher.data?.success) {
            setUserInfo(fetcher.data.user);
            console.log("navigating to " + (searchParams.get("redirectedfrom") || "/"));
            navigateTo(searchParams.get("redirectedfrom") || "/");
        } else if (fetcher.data?.error) {
            setError(fetcher.data.error);
        }
    }, [fetcher.data, setUserInfo, navigateTo, searchParams]);



    
    useEffect(() => {
        if (!isLoading && isLoggedIn) {
            navigateTo("/")
        }
    }, [isLoading]) 

    const isSubmitting = fetcher.state === 'submitting'
    return (
        <div className='w-1/2 h-screen flex flex-col justify-center items-center'>
            <div className="text-blue-400 mb-10">
                <h1 className='text-5xl text-center'>E-commerce</h1>
                <p className='text-black dark:text-white text-center'>Let's trade</p>
            </div>
            <fetcher.Form className="flex flex-col justify-center items-center w-full" method='post'>
                <input
                    className="tinput"
                    type="text"
                    name="email"
                    placeholder="Email or username"
                />
                <input
                    className="tinput"
                    type="password"
                    name='password'
                    placeholder="Password"
                />
                {error && <p className='text-red-600'>{error}</p>}
                <button
                    className={`mt-10 w-full disabled:cursor-default hover:cursor-pointer bg-blue-400 ${isSubmitting ? "" : "hover:bg-blue-700"} text-white transition duration-100 rounded-md p-3 m-4`}
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
                <a className="self-start text-blue-700 hover:text-blue-300 dark:hover:text-white" href='/reset-password'>Recover password</a>
                <button className="hover:cursor-pointer mt-10 w-full border border-gray-300 hover:border-blue-400 transition duration-100 text-gray-400 rounded-md p-3 m-4 flex justify-center items-center relative">
                    <svg className="absolute left-4 p-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="36px" height="36px">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                    </svg>
                    <span className="text-center w-full">Sign in with Google</span>
                </button>
            </fetcher.Form>
            <div className='absolute bottom-0 mb-2'>
                <label className='text-gray-400 text-center'>Don't have an account yet? </label>
                <Link className=" text-blue-700 hover:text-blue-300 dark:hover:text-white" to='/signup'>Sign Up</Link>

            </div>
        </div>
    );
}
