import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import PopupModal from '../components/PopupModal';

export default function ProductAdd() {
  const userCtx = useUser()
  const navigateTo = useNavigate()
  const location = useLocation()
  console.log(location);

  const [isEditing, setIsEditing] = useState('')
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    image: null
  });
  useEffect(() => {
    if (location?.state?.productInfo) {
      setFormData({
        name: location.state.productInfo.name,
        price: location.state.productInfo.price,
        stock: location.state.productInfo.stock,
        image: location.state.productInfo.image
      })
      setIsEditing(location.state.productInfo._id)
    } else {
      setFormData({
        name: '',
        price: '',
        stock: '',
        image: null
      })
      setIsEditing('')
    }
  }, [location?.state?.from])


  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === 'image' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      price: formData.price,
      stock: formData.stock,
      image: formData.image
    };
    const url = isEditing ? 'http://localhost:3001/api/products/edit-product/' + isEditing : 'http://localhost:3001/api/products/add-product'
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + userCtx.user.token
        }
      });
      
      console.log('Form submitted successfully:', response.data);
      navigateTo("/")
    } catch (error) {
      setError(error.response.data.message)
      console.error('Error submitting the form:', error);
    }
  };


  return (
    <>
      {error && <PopupModal title="Error" content={error} onConfirm={() => {setError('')}} onIgnore={() => {setError('')}}></PopupModal>}
      {!isEditing && <h1 className='mt-14 mb-2 mx-6 text-lg'>Add a New Product</h1>}
      {isEditing && <h1 className='mt-14 mb-2 mx-6 text-lg'>Edit Product</h1>}
      {isEditing && <h2 className='mb-2 mx-6 text-sm'>{isEditing}</h2>}
      <div className='flex justify-center items-center mx-5 border-2 rounded-2xl h-full p-2 border-gray-600'>
        <form onSubmit={handleSubmit} className='flex flex-col'>
          <div className='my-1 flex flex-col'>
            <label>Product Name</label>
            <input
              name="name"
              value={formData.name}
              className="rounded-lg p-1.5 placeholder:text-gray-500 outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500"
              placeholder="Your product name"
              onChange={handleChange} />
          </div>
          <div className='my-1 flex flex-col'>
            <label>Price</label>
            <input
              name="price"
              value={formData.price}
              className="rounded-lg p-1.5 placeholder:text-gray-500 outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500"
              placeholder="Product's initial price"
              onChange={handleChange} />
          </div>
          <div className='my-1 flex flex-col'>
            <label>Current Stock</label>
            <input
              name="stock"
              value={formData.stock}
              placeholder="How many"
              className="rounded-lg p-1.5 placeholder:text-gray-500 outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500"
              onChange={handleChange} />
          </div>
          <div className='my-1 flex flex-col'>
            <label>Image</label>
            <input
              type="file"
              value={formData.image}
              name="image"
              className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 dark:file:bg-gray-900 file:px-5 file:py-2 file:text-sm file:text-violet-500 dark:file:text-violet-800 hover:file:cursor-pointer rounded-lg p-1.5 placeholder:text-gray-500 hover:cursor-pointer outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500"
              onChange={handleChange} />
          </div>
          <div className='flex justify-end'>

            <button type="submit" className='rounded-lg hover:cursor-pointer bg-indigo-500 w-24 py-2 mt-4'>{isEditing ? "Edit" : "Create"}</button>
          </div>
        </form>
      </div>
    </>
  );
}

