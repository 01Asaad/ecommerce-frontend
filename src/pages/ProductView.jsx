import { useState, useEffect } from "react"
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from "../context/UserProvider";
import { TEMPLATEIMAGES } from "../constants/index"
import PopupModal from "../components/PopupModal";
import axios from "axios";

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
    const [currentActiveModal, setCurrentActiveModal] = useState(null)
    const { productID } = useParams();
    const userCtx = useUser()
    const navigateTo = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [productInfo, setProductInfo] = useState({
        name: '',
        description: '',
        image: '',
        _id: '',
        stock: '',
        price: '',
        purchaseCount: 0,
        provider: '',
        providerName: '',
        createdAt : '',
        modifiedAt : ''

    })

    function deletionResolveHandler() {
        navigateTo("/")
    }
    function productEdithandler() {
        navigateTo("/products/modify/" + productID, { state: { from: "/products/view/" + productID, productInfo: productInfo } })
    }
    function deletionHandler() {
        setCurrentActiveModal("deletionConfirmation")
    }
    async function deletionConfirmationHandler() {
        try {
            await axios.post(`http://localhost:3001/api/products/delete-product/${productID}`, {}, {
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
                const response = await axios.get(`http://localhost:3001/api/products/get-product/${productID}`)
                setProductInfo(response.data)
            } catch (error) {
                setCurrentActiveModal("error:" + error.message)
            }
            setIsLoading(false)
        }
        doo()

    }, [productID])


    return (
        <div className="flex flex-col justify-center  w-full">
            {currentActiveModal === "deletionConfirmation" && <PopupModal title="Product Deletion" content={`Are you sure you want to delete product ${productInfo.name}?`} onConfirm={deletionConfirmationHandler} isCancelleable onCancel={confirmationCancellationHandler} onIgnore={confirmationCancellationHandler} />}
            {currentActiveModal === "deletionResolve" && <PopupModal title="Product deleted" content={`${productInfo.name}  was deleted successfully`} onConfirm={deletionResolveHandler} onIgnore={deletionResolveHandler} />}
            {(isLoading) && (<h1>Loading product</h1>)}
            {(!productInfo.name && !isLoading) && (<h1>Not Found</h1>)}
            {(!isLoading && productInfo.name) && (
                <>
                    <div className="mt-5 pl-5 flex h-96 w-full justify-start items-center space-x-5">
                        <img
                            alt={productInfo.imageAlt}
                            src={productInfo.image ? "http://localhost:3001/" + productInfo.image : TEMPLATEIMAGES[0]}
                            className="aspect-square w-[20%] rounded-lg bg-gray-200 dark:bg-gray-800 object-cover group-hover:opacity-75 xl:aspect-7/8"
                        />
                        <div className=" ml-5 flex flex-col  justify-between h-full">
                            <div className="flex-2">
                                <h3 className="mt-7 text-3xl text-gray-700 dark:text-gray-300">{productInfo.name}</h3>
                            </div>
                            <div className="flex-3">
                                <p className="mt-1 text-md font-medium text-gray-900 dark:text-gray-400"> supplier : {productInfo.providerName}</p>
                                <p className="mt-1 text-md font-medium text-gray-900 dark:text-gray-400"> price : ${productInfo.price}</p>
                                <p className="mt-1 text-md font-medium text-gray-900 dark:text-gray-400"> stock : {productInfo.stock}</p>
                            </div>
                            <div className="flex-1 flex flex-col justify-end pb-5">
                                <span>Creation date : {formatDateWithTimezone(productInfo.createdAt)}</span>
                                <span>Last Update : {formatDateWithTimezone(productInfo.modifiedAt)}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        {productInfo.provider === userCtx.user.userID && <div className="mr-5 flex justify-end space-x-2">
                            <button className="bg-gray-600 p-2 rounded-lg hover:cursor-pointer" onClick={productEdithandler}>Edit</button>
                            <button className="bg-red-500 p-2 rounded-lg hover:cursor-pointer" onClick={deletionHandler}>Delete</button>
                        </div>}
                    </div>
                </>
            )}
        </div>
    )
}