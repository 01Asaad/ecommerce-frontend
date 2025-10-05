import React, { useState } from "react";
import { useNavigate, NavLink } from 'react-router-dom';
import DarkThemeManage from "./DarkThemeManage"
import {useUser} from "../context/UserProvider"
import PopupModal from "./PopupModal"
function addIfActive(fixedClasses, activeClasses, inactiveClasses = "") {
    return ({isActive}) => (fixedClasses + (isActive? (" "+activeClasses) : (" "+inactiveClasses)))
}
export default function GlobalNavBar() {
    const [isLogoutModalActive, setIsLogoutModalActive] = useState(false)
    const userCtx = useUser()
    const navigateTo = useNavigate()
    function logoutConfirmHandle() {
        userCtx.setUserInfo({
                email: '',
                firstName: '',
                lastName: '',
                username: "",
                token: ''
            })
        setIsLogoutModalActive(false)
        
    }
    function logoutCancelHandle() {
        setIsLogoutModalActive(false)
    }
    function handleAuthButton() {
        if (userCtx.isLoggedIn) {
            setIsLogoutModalActive(true)
        } else {
            navigateTo("/login");
        }
    }
    return (
        <div className="h-20 w-full top-0 bg-blue-500 dark:bg-gradient-to-l dark:from-gray-800 dark:to-blue-600 flex justify-between items-center mb-2">
            <div>
                <h1 className="ml-4 select-none text-3xl text-white">e-commerce</h1>
            </div>
            <div className="mx-5"> 
                <NavLink to="/" className={addIfActive("mx-2 hover:text-black dark:hover:text-gray-500", "text-red-500", "text-white")}>Main</NavLink>
                <NavLink className={addIfActive("mx-2 hover:text-black dark:hover:text-gray-500", "text-red-500", "text-white")} to="/products/">Products</NavLink>
            </div>
            <div className="mr-2 flex justify-end items-center gap-x-2">
                <DarkThemeManage></DarkThemeManage>
                {isLogoutModalActive && <PopupModal title="Logout" content="Are you sure you want to logout?" isCancelleable onConfirm={logoutConfirmHandle} onCancel={logoutCancelHandle} onIgnore={logoutCancelHandle} ></PopupModal>}
                <button className="bg-white opacity-70 w-10 h-10 ml-1 p-2 rounded-full text-gray-900 hover:text-gray-400 hover:cursor-pointer" onClick={handleAuthButton}>
                    {(!userCtx.isLoggedIn || !userCtx.user) && (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                        <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
                    </svg>)}
                    {(userCtx.isLoggedIn && userCtx.user) && (<span className="">{userCtx.user.firstName[0].toUpperCase()}</span>)}
                </button>
            </div>
        </div >
    )
}