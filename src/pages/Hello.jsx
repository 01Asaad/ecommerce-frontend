import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../context/UserProvider"

export default function Hello({children}) {
    const navigateTo = useNavigate()
    return (
        <div className='flex w-screen h-screen dark:bg-gray-800'>
            <div className='w-1/2 bg-blue-400'></div>
            <div className="w-1/2 flex flex-col justify-center items-center">
                <div className='w-1/2 h-screen flex flex-col justify-center items-center'>
                    {children}
                </div>
            </div>
        </div>
    );
}
