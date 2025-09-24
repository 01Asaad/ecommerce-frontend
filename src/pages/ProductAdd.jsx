import * as React from 'react';
import axios from 'axios';

export default function ProductAdd() {
  const [formData, setFormData] = React.useState({
    name: '',
    price: '',
    stock: '',
    image: null
  });



  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      price: formData.price,
      stock: formData.stock,
      image: formData.image
    };

    try {
      const response = await axios.post('http:localhost:3001/products/add-product', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Form submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };


  return (
    <>
      <h1 className='mt-14 mb-2 mx-6 text-lg'>Add New Product</h1>
      <div className='flex justify-center items-center mx-5 border-2 rounded-2xl h-full p-2 border-gray-600'>
        <form onSubmit={handleSubmit} className='flex flex-col'>
          <div className='my-1 flex flex-col'>
            <label>Product Name</label>
            <input name="name" className="border-2" placeholder="Write your name here" onChange={handleChange} />
          </div>
          <div className='my-1 flex flex-col'>
            <label>Price</label>
            <input name="price" className="border-2" placeholder="product's initial price" onChange={handleChange} />
          </div>
          <div className='my-1 flex flex-col'>
            <label>Current Stock</label>
            <input name="stock" placeholder="How many" className="border-2" onChange={handleChange} />
          </div>
          <div className='my-1 flex flex-col'>
            <label>Image</label>
            <input type="file" name="image" className="border-2 hover:cursor-pointer" onChange={handleChange} />
          </div>
          <button type="submit" className='hover:cursor-pointer border-2 w-sm mt-4'>Submit</button>
        </form>
      </div>
    </>
  );
}

