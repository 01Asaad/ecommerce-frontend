import React from "react";
import ProductViewer from "../components/ProductViewer.jsx";

export default function Home() {
    return (
        <>
            <div className="">
                <ProductViewer maxProducts={8} isShowAllProductsButtonShown={true}>

                </ProductViewer>
                
            </div>
        </>
    )
}
