import React from 'react'
import ProductCard from './ProductCard'
import { useAppCOntext } from '../context/AppContext'

const BestSeller = () => {

    const { products } = useAppCOntext();
    return (
        <div className='mt-14'>
            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="text-xs tracking-[0.3em] uppercase text-gray-500">Popular</p>
                    <h2 className='text-2xl lg:text-3xl font-semibold text-gray-900'>Featured Products</h2>
                    <div className="w-16 h-[3px] bg-[#d7a74a] mt-3 rounded-full"></div>
                </div>
            </div>
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-5 lg:grid-cols-5 lg:gap-6 mt-6'>
                {products.filter((product) => product.inStock).slice(0, 5).map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    )
}

export default BestSeller
