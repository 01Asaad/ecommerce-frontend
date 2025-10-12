import { useState, useEffect } from "react"
import { useNavigate, useParams, useLoaderData } from 'react-router-dom';
import { useUser } from "../context/UserProvider";
import { TEMPLATEIMAGES } from "../constants/index"
import PopupModal from "../components/UI/PopupModal";
import axios from "axios";
import useTWBreakpoints from "../hooks/useTWBreakpoints";
import { useMutation } from "@tanstack/react-query";
import { getToken } from "../utils/helpers";

const loaderCache = new Map()
const STALETIME = 60000

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

export function loader({ request, params }) {
    const cacheKey = `product-${params.productID}`
    const cachedData = loaderCache.get(cacheKey)

    if (cachedData && (Date.now() - cachedData.timestamp < STALETIME)) {
        return cachedData.data
    }

    return axios.get(import.meta.env.VITE_API_URL + `api/products/get-product/${params.productID}`)
        .then(response => {
            loaderCache.set(cacheKey, {
                data: response,
                timestamp: Date.now()
            });
            return response
        })
}

export function shouldReevaluate({ currentParams, nextParams }) {
    const resourceId = currentParams.id || nextParams.id
    const cachedData = loaderCache.get(`product-${resourceId}`)

    return !cachedData || Date.now() - cachedData.timestamp < STALETIME
}
const deleteProduct = async (productID) => {
    const response = await axios.post(
        import.meta.env.VITE_API_URL + `api/products/delete-product/${productID}`,
        {},
        {
            headers: {
                "Authorization": "Bearer " + getToken()
            }
        }
    );
    return response.data;
};
export default function ProductView() {
    const [breakpoint, doesWidthReach] = useTWBreakpoints()
    const loaderResponse = useLoaderData()
    const [currentActiveModal, setCurrentActiveModal] = useState(null)
    const { productID } = useParams();
    const userCtx = useUser()
    const navigateTo = useNavigate()
    const productInfo = loaderResponse.data

    const deleteProductMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: (data, variables, context) => {
            console.log('Product deleted successfully:', data);
            setCurrentActiveModal("deletionResolve")
        },
        onError: (error, variables, context) => {
            setCurrentActiveModal("error:" + error?.response?.data?.message || error.message)
            console.error('Error deleting product:', error);
        },
    });

    function deletionResolveHandler() {
        navigateTo("/products", {
            state: {
                from: "/product/view/:productID",
                productsUpdated: true,
                productUpdateDetails: { "action": "delete", "productIDs": [productID] }
            }
        })
    }
    function productEdithandler() {
        navigateTo("/products/modify/" + productID, { state: { from: "/products/view/" + productID, productInfo: productInfo } })
    }
    function deletionHandler() {
        setCurrentActiveModal("deletionConfirmation")
    }
    async function deletionConfirmationHandler() {
        deleteProductMutation.mutate(productID)
    }
    
    function confirmationCancellationHandler() {
        setCurrentActiveModal(null)
    }
    const imageEl = productInfo.image === "blank" ? <div className="aspect-square w-[50%] sm:w-[20%] rounded-lg bg-gray-200 dark:bg-gray-800 object-cover group-hover:opacity-75 xl:aspect-7/8" /> : <img
        alt={productInfo.imageAlt}
        src={productInfo.image ? import.meta.env.VITE_API_URL + productInfo.image : TEMPLATEIMAGES[0]}
        className="aspect-square w-[50%] sm:w-[20%] rounded-lg bg-gray-200 dark:bg-gray-800 object-cover group-hover:opacity-75 xl:aspect-7/8"
    />

    return (
        <div className="flex flex-col justify-center  w-full">
            {currentActiveModal === "deletionConfirmation" && <PopupModal
                isError isCancelleable
                inputDisabled={deleteProductMutation.isPending}
                title="Product Deletion"
                content={`Are you sure you want to delete product "${productInfo.name}"? This action can't be undone.`}
                confirmText={deleteProductMutation.isPending ? "Deleting..." : null}
                onConfirm={deletionConfirmationHandler}
                onCancel={confirmationCancellationHandler}
                onIgnore={confirmationCancellationHandler}
            />}
            {currentActiveModal === "deletionResolve" && <PopupModal title="Product deleted" content={`"${productInfo.name}" was deleted successfully`} onConfirm={deletionResolveHandler} onIgnore={deletionResolveHandler} />}
            {currentActiveModal && currentActiveModal.startsWith("error:") && <PopupModal
                isError
                title="Error"
                content={currentActiveModal.slice(6)}
                confirmText={"Dismiss"}
                onConfirm={() => {setCurrentActiveModal(null)}}
            />}
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
                    <div className={"flex-1 flex flex-col sm:justify-end items-center pb-5" + (doesWidthReach("sm") ? "" : " fixed bottom-0")}>
                        <span className="text-center">Creation date : {formatDateWithTimezone(productInfo.createdAt)}</span>
                        <span className="text-center">Last Update : {formatDateWithTimezone(productInfo.modifiedAt)}</span>
                    </div>
                </div>
            </div>
            <div>
                {(productInfo.provider === userCtx.user.userID || userCtx.user.admin) && <div className="mr-5 flex justify-end space-x-2">
                    <button className="bg-gray-600 text-white p-2 rounded-lg hover:cursor-pointer" onClick={productEdithandler}>Edit</button>
                    <button className="bg-red-500 text-white p-2 rounded-lg hover:cursor-pointer" onClick={deletionHandler}>Delete</button>
                </div>}
            </div>
        </div>
    )
}