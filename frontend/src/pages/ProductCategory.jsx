import React from 'react'
import { useAppCOntext } from '../context/AppContext'
import { useParams } from 'react-router-dom'
import { categories } from '../assets/assets';
import ProductCard from '../components/ProductCard'
const ProductCategory = () => {
    const { products } = useAppCOntext();

    const { category } = useParams()
    const searchCategory = categories.find((item) => item.path.toLowerCase() === category.toLowerCase())
    const filteredProducts = products.filter((product) => product.category.toLowerCase() === category.toLowerCase())
    return (
        <div>
            { searchCategory && (
               <div className='my-10 md:my-20'>
                    <p className='text-2xl lg:text-3xl font-medium  uppercase'>{searchCategory.text.toUpperCase()}</p>
                    <div className='w-16 h-1 bg-primary rounded-full mb-10'></div>
                    {filteredProducts.length > 0 ? (
                        <div className='grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-5 lg:grid-cols-5 lg:gap-6 mt-6'>
                            {filteredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <p className='text-lg text-gray-600'>No products found in this category.</p>
                    )}
                </div>   
            )}
        </div>
    )
}

export default ProductCategory
