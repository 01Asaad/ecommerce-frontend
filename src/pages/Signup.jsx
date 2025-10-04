import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useFetcher } from 'react-router-dom';
import { useUser } from '../context/UserProvider';

function validateInputs(email, password, username, firstName, lastName) {
    if (!email || !password || !username || !firstName || !lastName) {
        return "Please fill all fields."
    }
    if (password.length < 6) {
        return "password should be 6 characters or more."
    }
    return ""
}

export async function action({ request, params }) {
    let formData = await request.formData();
    formData = {
        email : formData.get("email"),
        password : formData.get("password"),
        username : formData.get("username"),
        firstName : formData.get("firstName"),
        lastName : formData.get("lastName"),
    }
    const error = validateInputs(formData.email, formData.password, formData.username, formData.firstName, formData.lastName)
    if (error) {
        return {error}
    }

    try {
        const response = await axios.post(import.meta.env.VITE_API_URL + 'api/auth/signup', formData);
        return {success : true, resData : response.data}
    } catch (error) {
        return {error : error}
    }

}

export default function Signup() {
    const navigateTo = useNavigate()
    const fetcher = useFetcher()
    const [error, setError] = useState("")
    const { isLoading, isLoggedIn, user, setUserInfo } = useUser()

    useEffect(() => {
            if (!isLoading && isLoggedIn) {
                navigateTo("/")
            }
        }, [isLoading])

    useEffect(() => {
        if (fetcher.data?.success) {
            console.log(fetcher.data);
            
            setUserInfo(fetcher.data.resData.userInfo)
            navigateTo("/")
        } else {
            setError(fetcher.data?.error ? fetcher.data.error : "")
        }
    })
    const isSubmitting = fetcher.state === "submitting"
    return (
        <div className='w-1/2 h-screen flex flex-col justify-center items-center'>
            <div className="text-blue-400 mb-10">
                <h1 className='text-5xl text-center'>E-commerce</h1>
                <p className='text-black dark:text-white text-center'>Let's trade</p>
            </div>
            <fetcher.Form className="flex flex-col justify-center items-center w-full" method="post">
                <input
                    className="tinput"
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                />
                <input
                    className="tinput"
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                />
                <input
                    className="tinput"
                    type="email"
                    placeholder="Email"
                    name="email"
                />
                <input
                    className="tinput"
                    type="text"
                    name="username"
                    placeholder="username"
                />
                <input
                    className="tinput"
                    type="password"
                    placeholder="Password"
                    name="password"
                />
                {error && <p className='text-red-600'>{error}</p>}
                <button
                    className={`mt-10 w-full disabled:cursor-default hover:cursor-pointer bg-blue-400 ${isSubmitting ? "" : "hover:bg-blue-700"} text-white transition duration-100 rounded-md p-3 m-4`}
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting? 'Creating user...' : 'Signup'}
                </button>
            </fetcher.Form>
            <div className='absolute bottom-0 mb-2'>
                <label className='text-gray-400 text-center'>Already have an account? </label>
                <Link className=" text-blue-700 hover:text-blue-300 dark:hover:text-white" to='/login'>Login</Link>

            </div>
        </div>
    );
}
