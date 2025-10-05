import { Link } from "react-router-dom"
import { TEMPLATEIMAGES } from "../constants/index"

export default function ProductList({ products, loading }) {
  if (loading > 0) {
    products = []
    for (let i = 0; i < loading; i++) {      
      products.push({
        _id: i,
        name: ' ',
        href: '#',
        price: ' ',
        image: 'blank',
        imageAlt: 'gray background',
      })
    }
  }

  return (
    <div className="bg-white dark:bg-gray-950 mx-0 ">
      <div className=" px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-12 lg:px-8">
        <h2 className="sr-only">Products</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <Link key={product._id} to={loading ? "#" : `/products/view/${product._id}`} className="group">
              {product.image === "blank" ? <div className="aspect-square w-full rounded-lg bg-gray-200 dark:bg-gray-800 object-cover group-hover:opacity-75 xl:aspect-7/8"/> : <img
                alt={product.imageAlt}
                src={product.image ? import.meta.env.VITE_API_URL + product.image : TEMPLATEIMAGES[index % 8]}
                className="aspect-square w-full rounded-lg bg-gray-200 dark:bg-gray-800 object-cover group-hover:opacity-75 xl:aspect-7/8"
              />}
              <h3 className="mt-4 text-sm text-gray-700 dark:text-gray-300">{product.name}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900 dark:text-gray-400">{product.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}