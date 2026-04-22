import React from 'react'
import { assets, features } from '../assets/assets'

const BottomBanner = () => {
    return (
        <section className='relative mt-20 overflow-hidden rounded-2xl border border-gray-200 bg-white'>
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative min-h-[360px]">
                    <img src={assets.bottom_banner_image} alt="bottomBanner" className='absolute inset-0 w-full h-full object-cover hidden md:block' />
                    <img src={assets.bottom_banner_image_sm} alt="bottomBanner" className='absolute inset-0 w-full h-full object-cover md:hidden' />
                    <div className="absolute inset-0 bg-black/45" />
                    <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
                        <p className="text-white/80 text-xs tracking-[0.3em] uppercase">Why choose us</p>
                        <h2 className='font-display text-white text-3xl md:text-4xl font-semibold mt-3 leading-tight'>
                            Quality that elevates every space.
                        </h2>
                        <p className="text-white/80 text-sm mt-3 max-w-md">
                            From selection to delivery, we help you build with premium materials and expert support.
                        </p>
                    </div>
                </div>

                <div className="p-8 md:p-10">
                    <p className="text-xs tracking-[0.3em] uppercase text-gray-500">Benefits</p>
                    <h3 className="text-2xl font-semibold text-gray-900 mt-2">What you get</h3>
                    <div className="w-16 h-[3px] bg-[#d7a74a] mt-3 rounded-full"></div>

                    <div className="mt-6 space-y-4">
                        {features.map((feature, index) => (
                            <div key={index} className='flex items-start gap-4'>
                                <div className="w-11 h-11 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0">
                                    <img src={feature.icon} alt={feature.title} className='w-6 h-6 opacity-80' />
                                </div>
                                <div>
                                    <h4 className='text-base font-semibold text-gray-900'>{feature.title}</h4>
                                    <p className='text-gray-600 text-sm mt-0.5'>{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BottomBanner
