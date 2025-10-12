import React from "react";
import { createPortal } from "react-dom";


const Backdrop = props => {
    console.log("input is", props.inputDisabled);
    
    return <div onClick={props.inputDisabled ? () => {} : props.onIgnore} className="fixed top-0 left-0 w-[100%] h-[100vh] z-100 bg-black opacity-90"></div>
}
const Modal = props => {    
    return (
        <div className="flex w-screen sm:w-[40%] rounded-lg flex-col justify-center items-start fixed bottom-0 sm:bottom-auto sm:top-[30vh] sm:left-[30%] z-[100] overflow-hidden bg-white dark:bg-gray-900">
            <div className="flex flex-col lg:flex-row justify-start items-center lg:items-start w-full min-h-35 bg-white dark:bg-gray-800  pb-5">
                <div className="mr-2 ml-5 mt-7">
                    <div className={`mt-0.5 mx-3 flex size-16 shrink-0 items-center justify-center rounded-full ${props.isError ? "bg-red-500/10" : "bg-gray-500/10"} sm:ml-4 sm:size-14 sm:p-1`}>
                        <svg className={` m-1 ${props.isError ? "text-red-400" : ""}  size-12`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                    </div>
                </div>
                <div className={`py-5 pt-7 w-full flex flex-col space-y-3 justify-center`}>
                    <h3 className="text-base text-center sm:text-left font-bold text-gray-900 dark:text-gray-100">{props.title}</h3>
                    <h5 className="text-sm text-center sm:text-left text-gray-500 dark:text-gray-400">{props.content}</h5>
                </div>
            </div>
            <footer className="flex flex-col lg:flex-row bg-gray-100 dark:bg-gray-900 min-h-20 dark:border-t border-black lg:justify-end w-full px-5 py-2">
                {(props.isCancelleable) && <button
                className={`bg-white lg:w-1/2 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-600 text-black dark:text-white w-full font-medium lg:mx-2 my-2 px-4 py-3 rounded-md`}
                onClick={props.onCancel}
                disabled={props.inputDisabled}
                >Cancel</button>}
                <button
                className={`${props.isError ? "bg-red-600 hover:bg-red-500" : "bg-cyan-500 hover:bg-cyan-700 dark:bg-gray-800 dark:hover:bg-gray-600"} text-white ${props.isCancelleable ? "lg:w-1/2" : "w-full"} font-medium my-2 lg:m-2 px-4 py-3 rounded-md`}
                disabled={props.inputDisabled}
                onClick={props.onConfirm}
                >{props.confirmText || "Confirm"}</button>
            </footer>
        </div>
    )
}
export default function PopupModal(props) {
    // props : onIgnore, onConfirm, onCancel, title, content, isCancelleable, confirmText, inputDisabled
    return (
        <>
            {createPortal((<Backdrop {...props} />), document.getElementById("backdrop-root"))}
            {createPortal((<Modal {...props} />), document.getElementById("overlay-root"))}
        </>
    )
}