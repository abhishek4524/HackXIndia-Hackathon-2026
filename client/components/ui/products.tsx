'use client'
import * as React from 'react'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  description: string
  price: string
  image: string
  category: string
}

const Products: React.FC = () => {
  const [visibleProducts, setVisibleProducts] = React.useState(6)
  const products: Product[] = [
    {
      id: 1,
      name: 'Desi Seeds Pack',
      description: 'High-quality indigenous seeds for vegetables & grains',
      price: '₹299',
      image: 'https://images.pexels.com/photos/41959/food-grains-bread-wheat-cereals-41959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Seeds'
    },
    {
      id: 2,
      name: 'Organic Cow Dung Fertilizer',
      description: 'Traditional natural manure for soil health and fertility',
      price: '₹599',
      image: 'https://i.pinimg.com/736x/61/a4/a7/61a4a76ae2317b3f87d45088a6ee6baf.jpg',
      category: 'Fertilizer'
    },
    {
      id: 3,
      name: 'Indian Kisan Tool Kit',
      description: 'Essential farming and gardening tools for every farmer',
      price: '₹1,499',
      image: 'https://images.pexels.com/photos/8993775/pexels-photo-8993775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Tools'
    },
    {
      id: 4,
      name: 'Copper Watering Can',
      description: 'Durable traditional copper watering can for healthy plants',
      price: '₹799',
      image: 'https://i.pinimg.com/1200x/4d/13/2c/4d132cf4ba1c571eb6cb303696ea092d.jpg',
      category: 'Tools'
    },
    {
      id: 5,
      name: 'Eco-Friendly Clay Pots',
      description: 'Handmade biodegradable mitti ke gamle (clay pots)',
      price: '₹399',
      image: 'https://i.pinimg.com/736x/3c/1d/22/3c1d2299eb96f44d73684c52215641e5.jpg',
      category: 'Containers'
    },
    {
      id: 6,
      name: 'Cotton Farming Gloves',
      description: 'Soft, breathable gloves for safe farming and gardening',
      price: '₹249',
      image: 'https://i.pinimg.com/1200x/56/75/27/56752706024d07b2fe59d990e37bda49.jpg',
      category: 'Safety'
    },
    {
      id: 7,
      name: 'Traditional Sickle',
      description: 'Hand-forged iron sickle for harvesting crops',
      price: '₹449',
      image: 'https://i.pinimg.com/1200x/f9/0d/14/f90d145fb235853a0882515e6303df71.jpg',
      category: 'Tools'
    },
    {
      id: 8,
      name: 'Organic Neem Pesticide',
      description: 'Natural pest control solution from neem extracts',
      price: '₹349',
      image: 'https://i.pinimg.com/1200x/03/08/80/030880592f18f25020b442690e737ebc.jpg',
      category: 'Pesticide'
    },
    {
      id: 9,
      name: 'Jute Twine Roll',
      description: 'Eco-friendly jute twine for plant support and tying',
      price: '₹149',
      image: 'https://i.pinimg.com/1200x/6a/1a/ce/6a1acec54f7063efdc5e1cd6429a1d56.jpg',
      category: 'Accessories'
    }
  ]

  const showMoreProducts = () => {
    setVisibleProducts(prev => Math.min(prev + 3, products.length))
  }

  return (
    <section className="bg-green-50 py-12 px-4">
      <div className="container mx-auto">
        {/* Header with decorative elements */}
        <div className="text-center mb-12 relative">
          <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 flex justify-center items-center">
            <div className="w-24 h-1 bg-green-300 rounded-full mx-2"></div>
            <div className="w-6 h-6 bg-green-400 rounded-full mx-2"></div>
            <div className="w-24 h-1 bg-green-300 rounded-full mx-2"></div>
          </div>
          <h1 className="text-4xl font-bold text-green-800 relative z-10 bg-green-50 inline-block px-6">
            किसान बाजार (Kisaan Bazaar)
          </h1>
          <p className="mt-4 text-lg text-green-700 max-w-2xl mx-auto">
            Authentic farming products for the Indian farmer. Quality tools, seeds, and supplies for better yield.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.slice(0, visibleProducts).map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 border border-green-100"
            >
              <div className="overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {product.category}
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-green-900 mb-2">
                  {product.name}
                </h2>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-700 font-bold text-lg">
                    {product.price}
                  </span>
                  <button className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 hover:shadow-md transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More / View All Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {visibleProducts < products.length && (
            <button 
              onClick={showMoreProducts}
              className="bg-green-100 text-green-800 px-6 py-3 rounded-lg font-semibold hover:bg-green-200 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Load More Products
            </button>
          )}
          
          <Link 
            href="/products"
            className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            View All Products
          </Link>
        </div>

        {/* Decorative Footer */}
        <div className="mt-16 text-center text-green-800">
          <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <p className="text-sm">100% Authentic Products • Free Delivery on orders above ₹999 • Farmer Support Helpline</p>
        </div>
      </div>
    </section>
  )
}

export default Products