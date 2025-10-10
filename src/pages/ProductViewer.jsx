import React, { useState, useEffect } from 'react';
import SortDropdown from "../components/SortDropdown.jsx";
import ProductList from "../components/ProductList.jsx"
import ErrorCard from '../components/ErrorCard.jsx'
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const fetchProducts = async (userID, sortCriteria, sortOrder, maxProducts, keyword, exactMatch) => {
  console.log("fetchcing prods " + keyword);
  const isExactMatch = exactMatch
  try {
    const url = import.meta.env.VITE_API_URL + `api/products/get-products${userID ? "/" + userID : ""}?sortBy=${sortCriteria}&order=${sortOrder}&limit=${maxProducts}&exactMatch=${isExactMatch}${keyword ? "&keyword=" + keyword : ""}`;
    const response = await axios.get(url)
    return { data: response.data }
  } catch (error) {
    console.error(error);
    return { error: error.response.data?.message || error.message }
  }
};


const ProductViewer = ({ userID, isShowAllProductsButtonShown = false, isAddButttonEnabled = false, isSortBarShown = false, maxProducts = 0, initialSortCriteria = "createdAt", initialSortOrder = "asc" }) => {
  const location = useLocation()
  const [filters, setFilters] = useState({
    sortCriteria : initialSortCriteria,
    sortOrder : initialSortOrder,
    keyword : location.state?.keyword || "",
    exactMatch : false,
    userID : userID
  })
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    async function doo() {
      setIsLoading(true)
      const res = await fetchProducts(filters.userID, filters.sortCriteria, filters.sortOrder, maxProducts, filters.keyword, filters.exactMatch);
      if (res?.error) {
        setError(res.error)
      }
      setProducts(res?.data || [])
      setIsLoading(false)
    }
    const timeoutID = setTimeout(doo, 1000)
    return () => {
      clearTimeout(timeoutID)
    }
  }, [filters.sortCriteria, filters.sortOrder, filters.userID, filters.keyword, filters.exactMatch, maxProducts]);

  if (error) {
    console.log(error)
    return <ErrorCard title="Error" message={`Failed loading products`} />;
  }

  return (
    <div className='flex flex-col justify-center'>
      {isSortBarShown && <SortDropdown filters={filters} setFilters={setFilters}></SortDropdown>}
      <ProductList products={products} loading={isLoading ? 8 : 0} />
      {isAddButttonEnabled && <Link to="/products/add" className='fixed bottom-10 right-10 z-10 py-6 px-10 text-2xl rounded-3xl bg-blue-500 text-white hover:cursor-default hover:bg-blue-300'>Add</Link>}
      {isShowAllProductsButtonShown && !isLoading && <div className='mb-10 py-1 px-4 sm:px-6 lg:px-8 max-w-full'>
        {<Link className=" py-5 inline-block w-full rounded-4xl text-center outline-2 outline-gray-500 hover:text-gray-600" to="/products/">Show all products</Link>}
      </div>}
    </div>
  )
};

export default ProductViewer;

