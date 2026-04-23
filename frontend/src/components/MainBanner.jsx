import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { useAppCOntext } from '../context/AppContext'

const MainBanner = () => {
  const { setShowEnquiry } = useAppCOntext()

  return (
    <section className="relative overflow-hidden w-screen left-1/2 -translate-x-1/2 rounded-none sm:rounded-2xl">
      <div className="relative">
        <video
          className="w-full object-cover min-h-[420px] sm:min-h-[520px]"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={assets.banner_vdo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/35 to-transparent" />
      </div>

      <div className="absolute inset-0 flex items-center md:px-14 lg:px-18">
        <div className="w-full px-6 md:px-12 lg:px-16">
          <div className="max-w-3xl">
            <p className="text-white/80 tracking-[0.3em] uppercase text-xs md:text-sm">
              Premium stones & tiles
            </p>
            <h1 className="mt-4 text-white leading-[0.95] font-display text-balance">
              <span className="block text-3xl md:text-6xl lg:text-7xl font-semibold">
                The Masterpiece of
              </span>
              <span className="block text-4xl md:text-6xl lg:text-7xl font-semibold italic text-[#d7a74a]">
                Italian Luxury Marble
              </span>
            </h1>
            <p className="mt-5 text-white/85 text-sm md:text-base max-w-2xl">
              India’s trusted supplier of premium marble, granite, tiles and sanitaryware. Get expert guidance for your bespoke architectural vision.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setShowEnquiry(true)}
                className="h-12 px-8 bg-[#d7a74a] hover:bg-[#c7963a] transition text-black font-semibold tracking-[0.18em] uppercase text-xs"
              >
                Consult an Expert
              </button>
              <Link
                to="/products"
                className="h-12 px-8 border border-white/60 hover:border-white text-white grid place-items-center tracking-[0.18em] uppercase text-xs"
              >
                Explore Gallery
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MainBanner
