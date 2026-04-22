
import ProductCard from '../components/ProductCard'
import { useAppCOntext } from '../context/AppContext'
import { useState, useEffect } from 'react'
const AllProduct = () => {
    const { products,searchQuery } = useAppCOntext();
    const [filteredProducts, setFilteredProducts] = useState([])

    useEffect(() => {
        if(searchQuery.length > 0){
            // Filter products based on search query
            setFilteredProducts(products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase())))  
        }
        else {
            setFilteredProducts(products)
        }
    }, [searchQuery, products])

    return (
        <div className='my-10 md:my-20'>
            <h2 className='text-2xl lg:text-3xl font-medium  uppercase'>All Products</h2>
            <div className='w-16 h-1 bg-primary rounded-full mb-10'></div>
            <div className='grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-5 lg:grid-cols-5 lg:gap-6 mt-6'>
                {filteredProducts.filter((product) => product.inStock).map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    )
}

export default AllProduct
