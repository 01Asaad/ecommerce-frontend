import React, { useState } from "react";

export default function InputGroup(props) {
    const [validationError, setvalidationError] = useState("")
    function inputBlurHandler(event) {
        if (props.validate) {
            let validationResult = props.validate(event.target.value)
            setvalidationError(validationResult)
            props.validationResultHanler(validationResult)
        }


    }
    return (
        <>
            {props.label && <label className={props.labelClasses}>{props.label}</label>}
            <input placeholder={props.placeholder} className="" onBlur={inputBlurHandler} />
            {validationError && <span className="text-red-600">{validationError}</span>}
        </>
    )
}