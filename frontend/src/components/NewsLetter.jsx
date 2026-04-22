import React from 'react'

const NewsLetter = () => {
    return (
        <section className="mt-20 pb-14">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 md:p-10 text-center">
                <p className="text-xs tracking-[0.3em] uppercase text-gray-500">Updates</p>
                <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold text-gray-900">
                    Get new arrivals & project inspiration
                </h2>
                <p className="mt-3 text-gray-600">
                    Subscribe for new collections, offers, and expert tips.
                </p>
                <form className="mt-7 flex flex-col sm:flex-row items-stretch justify-center gap-3 max-w-2xl mx-auto">
                    <input
                        className="border border-gray-300 h-12 outline-none px-4 text-gray-700"
                        type="text"
                        placeholder="Enter your email"
                        required
                    />
                    <button
                        type="submit"
                        className="h-12 px-8 text-white bg-black hover:bg-gray-900 transition-all cursor-pointer tracking-[0.2em] uppercase text-xs font-semibold"
                    >
                        Subscribe
                    </button>
                </form>
            </div>
        </section>
    )
}

export default NewsLetter
