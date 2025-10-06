import { useState, useEffect } from "react"
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from "../context/UserProvider";
import { TEMPLATEIMAGES } from "../constants/index"
import PopupModal from "../components/PopupModal";
import axios from "axios";
import useTWBreakpoints from "../hooks/useTWBreakpoints";

function formatDateWithTimezone(dateString, timezoneOffset = 0) {
    const date = new Date(dateString);
    const targetDate = new Date(date.getTime() + timezoneOffset * 60 * 60 * 1000);
    const day = String(targetDate.getUTCDate()).padStart(2, '0');
    const month = String(targetDate.getUTCMonth() + 1).padStart(2, '0');
    const year = targetDate.getUTCFullYear();
    const hours = String(targetDate.getUTCHours()).padStart(2, '0');
    const minutes = String(targetDate.getUTCMinutes()).padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes}UTC`;
}


export default function ProductView() {
    const bp = useTWBreakpoints()
    const [currentActiveModal, setCurrentActiveModal] = useState(null)
    const { productID } = useParams();
    const userCtx = useUser()
    const navigateTo = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [productInfo, setProductInfo] = useState({
        name: '',
        description: '',
        image: 'blank',
        _id: '',
        stock: '',
        price: '',
        purchaseCount: 0,
        provider: '',
        providerName: '',
        createdAt: '',
        modifiedAt: ''

    })

    function deletionResolveHandler() {
        navigateTo("/products")
    }
    function productEdithandler() {
        navigateTo("/products/modify/" + productID, { state: { from: "/products/view/" + productID, productInfo: productInfo } })
    }
    function deletionHandler() {
        setCurrentActiveModal("deletionConfirmation")
    }
    async function deletionConfirmationHandler() {
        try {
            await axios.post(import.meta.env.VITE_API_URL + `api/products/delete-product/${productID}`, {}, {
                headers: {
                    "Authorization": "Bearer " + userCtx.user.token
                }
            })
            setCurrentActiveModal("deletionResolve")
        } catch (error) {
            setCurrentActiveModal("error:" + error.message)
        }
    }
    function confirmationCancellationHandler() {
        setCurrentActiveModal(null)
    }
    useEffect(() => {
        const doo = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_API_URL + `api/products/get-product/${productID}`)
                setProductInfo(response.data)
            } catch (error) {
                setCurrentActiveModal("error:" + error.message)
            }
            setIsLoading(false)
        }
        doo()

    }, [productID])
    const imageEl = productInfo.image === "blank" ? <div className="aspect-square w-[50%] sm:w-[20%] rounded-lg bg-gray-200 dark:bg-gray-800 object-cover group-hover:opacity-75 xl:aspect-7/8" /> : <img
        alt={productInfo.imageAlt}
        src={productInfo.image ? import.meta.env.VITE_API_URL + productInfo.image : TEMPLATEIMAGES[0]}
        className="aspect-square w-[50%] sm:w-[20%] rounded-lg bg-gray-200 dark:bg-gray-800 object-cover group-hover:opacity-75 xl:aspect-7/8"
    />

    return (
        <div className="flex flex-col justify-center  w-full">
            {currentActiveModal === "deletionConfirmation" && <PopupModal isError title="Product Deletion" content={`Are you sure you want to delete product ${productInfo.name}? This action can't be undone.`} onConfirm={deletionConfirmationHandler} isCancelleable onCancel={confirmationCancellationHandler} onIgnore={confirmationCancellationHandler} />}
            {currentActiveModal === "deletionResolve" && <PopupModal title="Product deleted" content={`${productInfo.name}  was deleted successfully`} onConfirm={deletionResolveHandler} onIgnore={deletionResolveHandler} />}
            {/* {(isLoading) && (<h1 className="mt-10 text-center text-4xl">Loading product</h1>)} */}
            {(!productInfo.name && !isLoading) && (<h1>Not Found</h1>)}
            {(
                <>
                    <div className="mt-5 pl-5 flex flex-col sm:flex-row h-96 w-full justify-center sm:justify-start items-center sm:space-x-5">
                        {imageEl}
                        <div className="ml-5 flex flex-col justify-between items-center sm:items-start h-full">
                            <div className="flex-2">
                                <h3 className="mt-7 text-3xl text-gray-700 text-center sm:text-left dark:text-gray-300">{productInfo.name}</h3>
                            </div>
                            <div className="flex-3">
                                <p className="mt-1 text-md font-medium text-gray-900 text-center sm:text-left dark:text-gray-400"> supplier : {productInfo.providerName}</p>
                                <p className="mt-1 text-md font-medium text-gray-900 text-center sm:text-left dark:text-gray-400"> price : ${productInfo.price}</p>
                                <p className="mt-1 text-md font-medium text-gray-900 text-center sm:text-left dark:text-gray-400"> stock : {productInfo.stock}</p>
                            </div>
                            <div className={"flex-1 flex flex-col sm:justify-end items-center pb-5" + (bp==="xs" ? " fixed bottom-0" : "")}>
                                <span className="text-center">Creation date : {formatDateWithTimezone(productInfo.createdAt)}</span>
                                <span className="text-center">Last Update : {formatDateWithTimezone(productInfo.modifiedAt)}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        {productInfo.provider === userCtx.user.userID && !isLoading && <div className="mr-5 flex justify-end space-x-2">
                            <button className="bg-gray-600 text-white p-2 rounded-lg hover:cursor-pointer" onClick={productEdithandler}>Edit</button>
                            <button className="bg-red-500 text-white p-2 rounded-lg hover:cursor-pointer" onClick={deletionHandler}>Delete</button>
                        </div>}
                    </div>
                </>
            )}
        </div>
    )
}