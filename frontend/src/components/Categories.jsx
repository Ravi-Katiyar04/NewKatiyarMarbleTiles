// import React, { useState , useEffect} from 'react'
import { categories } from '../assets/assets'
import { useAppCOntext } from '../context/AppContext'

const Categories = () => {

    const { navigate } = useAppCOntext()

    return (
        <div className="mt-16">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="text-xs tracking-[0.3em] uppercase text-gray-500">Explore</p>
                    <p className="text-2xl md:text-3xl font-semibold text-gray-900">Collections</p>
                    <div className="w-16 h-[3px] bg-[#d7a74a] mt-3 rounded-full"></div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-8 gap-4 md:gap-6">

                {categories.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="group cursor-pointer rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-sm transition duration-200 ease-in-out bg-white"
                            onClick={() => {
                                navigate(`/products/${item.path.toLowerCase()}`);
                                window.scrollTo(0,0);
                            }}
                        >
                            <div className="h-24 md:h-28 bg-gray-50 flex items-center justify-center">
                                <img src={item.image} alt={item.text} className="group-hover:scale-[1.05] transition duration-200 ease-in-out max-h-20 md:max-h-24 object-contain" />
                            </div>
                            <div className="px-3 py-3">
                                <p className="text-[13px] font-semibold text-gray-900 leading-snug">{item.text}</p>
                                <p className="text-[11px] tracking-[0.22em] uppercase text-gray-500 mt-1">View</p>
                            </div>
                        </div>
                    );
                })}


            </div>
        </div>
    )
}

export default Categories
