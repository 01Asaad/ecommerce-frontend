import React from "react";
import { useNavigate, NavLink } from 'react-router-dom';
import DarkThemeManage from "./DarkThemeManage"

export default function GlobalNavBar() {
    const navigateTo = useNavigate()
    function handleLogin() {
        navigateTo("/login");
    }
    return (
        <div className="h-20 w-full top-0 bg-blue-500 dark:bg-gradient-to-l dark:from-gray-800 dark:to-blue-500 flex justify-between items-center mb-2">
            <div>
                <h1 className="ml-4 text-3xl text-white">e-commerce</h1>
            </div>
            <div className="mx-5"> 
                <NavLink to="/" className={({isActive}) => (isActive ? "text-red-500 mx-2" : "mx-2")}>Main</NavLink>
                <NavLink className={({isActive}) => (isActive ? "text-red-500 mx-2" : "mx-2")} to="/products/add-product">Add-Product</NavLink>
            </div>
            <div className="mr-2 flex justify-end items-center gap-x-2">
                <DarkThemeManage></DarkThemeManage>
                <button className="bg-white opacity-70 ml-1 p-2 rounded-full text-gray-900 hover:text-gray-400" onClick={handleLogin}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                        <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
                    </svg>

                </button>
            </div>
        </div >
    )
}