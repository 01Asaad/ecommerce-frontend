import React, { useState, useEffect } from 'react';
import SortDropdown from "../components/SortDropdown.jsx";
import ProductList from "../components/ProductList.jsx"
import ErrorCard from '../components/ErrorCard.jsx'
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const fetchProducts = async (userID, sortCriteria, sortOrder, maxProducts, keyword, exactMatch) => {
  console.log("fetching prods " + keyword);
  const isExactMatch = exactMatch;
  const url = import.meta.env.VITE_API_URL + `api/products/get-products${userID ? "/" + userID : ""}?sortBy=${sortCriteria}&order=${sortOrder}&limit=${maxProducts}&exactMatch=${isExactMatch}${keyword ? "&keyword=" + keyword : ""}`;
  const response = await axios.get(url);
  return response.data;
}

const ProductViewer = ({ userID, isShowAllProductsButtonShown = false, isAddButttonEnabled = false, isSortBarShown = false, maxProducts = 0, initialSortCriteria = "createdAt", initialSortOrder = "asc" }) => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    sortCriteria: initialSortCriteria,
    sortOrder: initialSortOrder,
    keyword: location.state?.keyword || "",
    exactMatch: false,
    userID: userID
  })

  const [debouncedKeyword, setDebouncedKeyword] = useState(filters.keyword)

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedKeyword(filters.keyword)
    }, filters.keyword ? 1000 : 0)

    return () => {
      clearTimeout(timerId)
    };
  }, [filters.keyword])

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', filters.userID, filters.sortCriteria, filters.sortOrder, maxProducts, debouncedKeyword, filters.exactMatch],
    queryFn: () => fetchProducts(filters.userID, filters.sortCriteria, filters.sortOrder, maxProducts, debouncedKeyword, filters.exactMatch),
    staleTime: 1000 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })
  useEffect(() => {
    if (location.state?.productsUpdated) {
      if (location.state?.productUpdateDetails?.action === "delete") {
        queryClient.setQueriesData(
          { queryKey: ['products'] },
          (old) => old?.filter((product) =>
            !location.state.productUpdateDetails.productIDs.includes(product._id)
          ) || []
        );
      } else if (location.state?.productUpdateDetails?.action === "modify") {
        queryClient.setQueriesData(
          { queryKey: ['products'] },
          (old) => old?.map((product) => {
            return product._id === location.state.productUpdateDetails.productInfo._id ? location.state.productUpdateDetails.productInfo : product
          }
          ) || []
        );
      } else { //better to invalidate when action==="create" because it brings many edge cases one of them being the new prod should respect the filters and its index in the array should be based on the sortOrder
        queryClient.invalidateQueries({ queryKey: ['products'] })
      }
    }
  }, [location.state?.productsUpdated, location.state?.productUpdateDetails?.action, queryClient, location.state?.productUpdateDetails?.productInfo?._id])

  if (error) {
    console.log(error);
    return <ErrorCard title="Error" message={`Failed loading products: ${error.response?.data?.message || error.message}`} />
  }

  return (
    <div className='flex flex-col justify-center'>
      {isSortBarShown && <SortDropdown filters={filters} setFilters={setFilters} />}
      <ProductList products={products} loading={isLoading ? 8 : 0} />
      {isAddButttonEnabled && <Link to="/products/add" className='fixed bottom-10 right-10 z-10 py-6 px-10 text-2xl rounded-3xl bg-blue-500 text-white hover:cursor-default hover:bg-blue-300'>Add</Link>}
      {isShowAllProductsButtonShown && !isLoading && <div className='mb-10 py-1 px-4 sm:px-6 lg:px-8 max-w-full'>
        {<Link className=" py-5 inline-block w-full rounded-4xl text-center outline-2 outline-gray-500 hover:text-gray-600" to="/products/">Show all products</Link>}
      </div>}
    </div>
  )
};

export default ProductViewer;