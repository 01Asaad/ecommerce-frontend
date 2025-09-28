import React from "react";
import { createPortal } from "react-dom";


const Backdrop = props => {
    return <div onClick={props.onIgnore} className="fixed top-0 left-0 w-[100%] h-[100vh] z-10 bg-black opacity-90"></div>
}
const Modal = props => {
    return (
        <div className="flex rounded-2xl flex-col justify-center items-center fixed top-[30vh] left-[30%] w-[40%] z-[100] overflow-hidden bg-white dark:bg-gray-900">
            <header className={`py-5 ${props.isError ? "bg-red-600" : "bg-blue-300 dark:bg-blue-900"}  w-full flex justify-center`}>
                {props.isError && <svg className="mt-0.5 mx-3 size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>}
                <h3 className="text-xl">{props.title}</h3>
            </header>
            <div className="p-10">
                <span>{props.content}</span>
            </div>
            <footer className="flex bg-gray-200 dark:bg-gray-900 dark:border-t border-black justify-end w-full px-5 py-2">
                {(props.isCancelleable) && <button className={`${props.isError ? "bg-red-700" : "bg-blue-400 dark:bg-blue-900"} hover:cursor-pointer ${props.isError ? "hover:bg-red-800" : "hover:bg-blue-600"} text-white m-2 px-4 py-3 rounded-xl`} onClick={props.onCancel}>Cancel</button>}
                <button className={`${props.isError ? "bg-red-700" : "bg-blue-400 dark:bg-blue-900"} hover:cursor-pointer ${props.isError ? "hover:bg-red-800" : "hover:bg-blue-600"} text-white m-2 px-4 py-3 rounded-xl`} onClick={props.onConfirm}>Confirm</button>
            </footer>
        </div>
    )
}
export default function PopupModal(props) {
    // props : onIgnore, onConfirm, onCancel, title, content, isCancelleable
    return (
        <>
            {createPortal((<Backdrop {...props} />), document.getElementById("backdrop-root"))}
            {createPortal((<Modal {...props} />), document.getElementById("overlay-root"))}
        </>
    )
}