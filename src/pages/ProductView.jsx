import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom';

export default function ProductView() {
    const { productID } = useParams();
    const [productInfo, setProductInfo] = useState({
        name : '',
        description : '',
        image : '',
        id : '',
        stock : '',
        price : '',
        purchaseCount : 0,

    })
    useEffect(() => {
        const doo = async () => {
            const response = await fetch(`http://localhost:3001/api/products/get-product/${productID}`)
            if (response.ok) {
                setProductInfo(response.body)
            } else {

            }
        } 
        doo()

    }, [productID])
    return (<>
    {!productInfo.name && (<h1>Not Found</h1>)}
    <div className="">
        <div className="">
        </div>
        <div className="">
            <h2>{productInfo.name}</h2>
            <h5>{productInfo.price}</h5>
            <hr></hr>
            <p>{productInfo.description}</p>
        </div>
        <div className="">

        </div>
    </div>
    </>)
}