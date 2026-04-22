
import { assets } from '../assets/assets'
import { useAppCOntext } from '../context/AppContext';

const ProductCard = ({ product }) => {
    const {currency, addToCard, cartItems, removeFromCart, navigate}= useAppCOntext();


    const getUnit = (category) => {
        switch (category) {
            case 'Natural_Stone':
            case 'Sanitary':
                return '/piece';
            case 'Vitrified_Tiles':
                return '/box';
            case 'Ceramic_Tiles':
                return '/box';
            case 'Grout_Fillers':
                return '/piece';
            case 'Elevation_Tiles':
                return '/box';
            case 'Marble':
                return '/sqrt ft';
            case 'Granite':
                return '/sqrt ft';

        }
    }

    return product && (
        <div
            onClick={() => {navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0,0)}}
            className="group border border-gray-200 bg-white w-full min-w-0 hover:shadow-md hover:-translate-y-0.5 transition"
        >
            <div className="bg-gray-50 border-b border-gray-100 overflow-hidden">
                <img
                    className="w-full h-44 sm:h-56 md:h-64 lg:h-72 object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    src={product.image?.[0]}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                />
            </div>

            <div className="px-3 sm:px-4 md:px-5 py-3 sm:py-4">
                <p className="text-[11px] tracking-[0.35em] uppercase text-[#8b1d1d]">
                    {(product.category || "").replaceAll("_", " ")}
                </p>

                <p className="mt-2 font-display text-lg sm:text-2xl md:text-[28px] leading-tight text-gray-900 line-clamp-2 min-h-[44px] sm:min-h-[56px]">
                    {product.name}
                </p>

                <p className="mt-2 text-sm text-gray-600 line-clamp-2 min-h-[36px] sm:min-h-[40px]">
                    {Array.isArray(product.description) ? (product.description[0] || "") : (product.description || "")}
                </p>

                <div className="flex items-center justify-between mt-3 gap-2">
                    <p className="text-[15px] sm:text-base font-semibold text-gray-900 min-w-0">
                        {currency}{product.offerPrice}
                        <span className="text-gray-500 font-normal text-xs">
                            {getUnit(product.category)}{" "}
                        </span>
                        <span className="text-gray-400 font-normal text-xs line-through ml-2 whitespace-nowrap">
                            {currency}{product.price}
                        </span>
                    </p>
                    <div onClick={(e)=> {e.stopPropagation();} } className="text-primary">
                        {!cartItems[product._id] ? (
                            <button
                                className="h-10 px-4 sm:px-5 border border-gray-900 text-gray-900 text-[11px] sm:text-xs tracking-[0.2em] uppercase hover:bg-gray-900 hover:text-white transition whitespace-nowrap"
                                onClick={() => addToCard(product._id)}
                            >
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 h-10 border border-gray-200 px-2 select-none">
                                <button onClick={() => removeFromCart(product._id)} className="cursor-pointer text-md px-2 h-full" >
                                    -
                                </button>
                                <span className="w-5 text-center">{cartItems[product._id]}</span>
                                <button onClick={() => addToCard(product._id)} className="cursor-pointer text-md px-2 h-full" >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard
