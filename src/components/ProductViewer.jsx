import React, { useState, useEffect } from 'react';
import SortDropdown from "./SortDropdown.jsx";
import ProductList from "./ProductList.jsx"
import GridComponent from './GridComponent.jsx';
import ErrorCard from './ErrorCard.jsx'
import axios from 'axios';
import { Link } from 'react-router-dom';


const ProductViewer = ({ userID, isShowAllProductsButtonShown = false, isAddButttonEnabled = false, isSortBarShown = false, maxProducts = 0, initialSortCriteria = "createdAt", initialSortOrder = "asc" }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortCriteria, setSortCriteria] = useState(initialSortCriteria);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);



  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const url = import.meta.env.VITE_API_URL + `api/products/get-products${userID ? "/" + userID : ""}?sortBy=${sortCriteria}&order=${sortOrder}&limit=${maxProducts}`;
        const response = await axios.get(url)
        setProducts(response.data);
      } catch (error) {
        setError(error.response.data?.message || error.message);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [sortCriteria, sortOrder, userID]);

  if (error) {
    console.log(error)
    return <ErrorCard title="Error" message={`Failed loading products`} />;
  }

  return (
    <div className='flex flex-col justify-center'>
      {isSortBarShown && <SortDropdown sortCriteria={sortCriteria} sortOrder={sortOrder} setSortCriteria={setSortCriteria} setSortOrder={setSortOrder}></SortDropdown>}
      <ProductList products={products} maxloading={isLoading ? 8 : 0} />
      {isAddButttonEnabled && <Link to="/products/add" className='fixed bottom-10 right-10 z-10 py-6 px-10 text-2xl rounded-3xl bg-blue-500 text-white hover:cursor-pointer hover:bg-blue-300'>Add</Link>}
      {isShowAllProductsButtonShown && !isLoading && <div className='mb-10 py-1 px-4 sm:px-6 lg:px-8 max-w-full'>
        {<Link className=" py-5 inline-block w-full rounded-4xl text-center outline-2 outline-gray-500 hover:text-gray-600" to="/products/">Show all products</Link>}
      </div>}
    </div>
  )
};

export default ProductViewer;

function loader({ request, params }) {

}