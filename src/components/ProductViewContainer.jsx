import React, { useState, useEffect } from 'react';
import SortDropdown from "./SortDropdown.jsx";
import ActionAreaCard from './ActionAreaCard.jsx';
import ProductList from "./ProductList.jsx"
import GridComponent from './GridComponent.jsx';
import ErrorCard from './ErrorCard.jsx'


const ProductViewContainer = ({ userID }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortCriteria, setSortCriteria] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('asc');



  useEffect(() => {
    const fetchProducts = async () => {
      console.log("getting prods");
      try {
        const url = `http://localhost:3001/api/products/get-products${userID ? "/" + userID : ""}?sortBy=${sortCriteria}&order=${sortOrder}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [sortCriteria, sortOrder]);

  if (error) {
    console.log(error)
    return <ErrorCard title="Error" message={`Failed loading products`} />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
      <ProductList>

      </ProductList>
    
  )
};

export default ProductViewContainer;

function loader({request, params}) {
  
}