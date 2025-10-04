import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserProvider';
import { useFetcher, useLocation, useNavigate } from 'react-router-dom';
import PopupModal from '../components/PopupModal';
import { getToken } from "../utils/helpers"

function validateFormInputs(name, price, stock, image) {
  if (!name || !price || !stock) {
    return "please fill out all fields."
  }
  if (isNaN(price)) {
    return "Incorrect price format. price can only be a valid number"
  }
  if (isNaN(stock)) {
    return "Incorrect stock format. stock can only be a valid number"
  }
  if (stock.includes(".")) {
    return "Incorrect stock format."
  }
  return ""
}

export async function action({ request, params }) {
  const formData = await request.formData()
  const data = {
    name: formData.get("name"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    image: formData.get("image")
  };

  const urlObj = new URL(request.url);
  const pathSegments = urlObj.pathname.split('/').filter(Boolean);
  const productID = pathSegments[pathSegments.length - 1] === "add" ? "" : pathSegments[pathSegments.length - 1]

  const error = validateFormInputs(data.name, data.price, data.stock, data.image)
  if (error) {
    return { error: error }
  }
  const url = import.meta.env.VITE_API_URL + (productID ? 'api/products/edit-product/' + productID : 'api/products/add-product')
  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        "Authorization": "Bearer " + getToken()
      }
    });

    console.log('Form submitted successfully:', response.data);
    return { success: true, resData: response.data }
  } catch (error) {
    console.error('Error submitting the form:', error);
    return { error: error }
  }
}

export default function ProductAdd() {
  const userCtx = useUser()
  const navigateTo = useNavigate()
  const location = useLocation()
  const fetcher = useFetcher()
  const [isEditing, setIsEditing] = useState('')
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    image: null
  });
  useEffect(() => {
    if (fetcher.state === "idle") {
      if (fetcher.data?.success) {
        navigateTo("/")
      } else if (fetcher.data?.error) {

        setError(fetcher.data.error?.response?.data?.message || fetcher.data.error?.message);
      }
    }

  }, [fetcher.state])


  useEffect(() => {
    if (location?.state?.productInfo) {
      setFormData({
        name: location.state.productInfo.name,
        price: location.state.productInfo.price,
        stock: location.state.productInfo.stock,
        image: null
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
  }, [location.state?.productInfo?._id])

  useEffect(() => {
    if (!userCtx.isLoading && !userCtx.isLoggedIn) {
      navigateTo("/login?redirectedfrom=/products/add")
    }
  }, [userCtx.isLoading, userCtx.isLoggedIn])
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === 'image' ? files[0] : value
    }));
  };

  const isIdle = fetcher.state === "idle"
  return (
    <>
      {error && <PopupModal title="Error" content={error} onConfirm={() => { setError('') }} onIgnore={() => { setError('') }}></PopupModal>}
      {!isEditing && <h1 className='mt-14 mb-2 mx-6 text-lg'>Add a New Product</h1>}
      {isEditing && <h1 className='mt-14 mb-0 mx-6 text-lg'>Edit Product</h1>}
      {isEditing && <h2 className='mb-2 mx-6 text-sm text-cyan-950'>#{isEditing}</h2>}
      <div className='flex justify-center items-center mt-2 mx-5 rounded-2xl h-full p-2 border-gray-600'>
        <fetcher.Form method='post' encType="multipart/form-data" className='flex flex-col'>
          <div className='my-1 flex flex-col'>
            <label>Product Name</label>
            <input
              name="name"
              value={formData.name}
              className="rounded-lg p-1.5 placeholder:text-gray-500 outline-1 -outline-offset-1 dark:outline-white/10 outline-black/25 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500"
              placeholder="Your product name"
              onChange={handleChange} />
          </div>
          <div className='my-1 flex flex-col'>
            <label>Price</label>
            <input
              name="price"
              value={formData.price}
              className="rounded-lg p-1.5 placeholder:text-gray-500 outline-1 -outline-offset-1 dark:outline-white/10 outline-black/25 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500"
              placeholder="Product's initial price"
              onChange={handleChange} />
          </div>
          <div className='my-1 flex flex-col'>
            <label>Current Stock</label>
            <input
              name="stock"
              value={formData.stock}
              placeholder="How many"
              className="rounded-lg p-1.5 placeholder:text-gray-500 outline-1 -outline-offset-1 dark:outline-white/10 outline-black/25 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500"
              onChange={handleChange} />
          </div>
          <div className='my-1 flex flex-col'>
            <label>Image</label>
            <input
              type="file"
              name="image"
              className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 dark:file:bg-gray-900 file:px-5 file:py-2 file:text-sm file:text-violet-500 dark:file:text-violet-800 hover:file:cursor-pointer rounded-lg p-1.5 placeholder:text-gray-500 hover:cursor-pointer outline-1 -outline-offset-1 dark:outline-white/10 outline-black/25 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500"
              onChange={handleChange} />
          </div>
          <div className='flex justify-end'>

            <button
              type="submit"
              className={`rounded-lg  ${isIdle ? "bg-indigo-500 hover:cursor-pointer" : "bg-blue-300"} w-24 py-2 mt-4`}
              disabled={!isIdle}
            >{isEditing ? "Edit" : "Create"}</button>
          </div>
        </fetcher.Form>
      </div>
    </>
  );
}

