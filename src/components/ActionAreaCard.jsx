import React from 'react';


export default function   ActionAreaCard({ product }) {
  return (
    <div className='shadow-3xl dark:bg-gray-900 bg-white'>
      <div className='flex flex-col'>
        <img className='w-full h-1/2 '
          src={product.image || '/static/images/product_icon.jpg'} 
          alt={product.name}
        />
        <div className='w-full h-1/2 p-2'>
          <h5 className='text-black dark:text-white text-2xl pb-2'>
            {product.name}
          </h5>
          <p className='text-gray-400'>
            Stock: {product.stock}
          </p>
          <p className="text-gray-400">
            Price: ${product.price}
          </p>
        </div>
      </div>
    </div>
  );
}
