
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppCOntext } from "../context/AppContext";
import NotificationBell from "./NotificationBell";
import toast from "react-hot-toast";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const { user, setUser, setShowUserLogin, setShowEnquiry, navigate, setSearchQuery, searchQuery, getCartCount, axios } =
        useAppCOntext();

    const navLinks = useMemo(() => {
        return [
            { label: "Home", to: "/" },
            {
                label: "Collection",
                dropdownKey: "collection",
                items: [
                    { label: "Marble Slabs", to: "/collections/marble" },
                    { label: "Granite Blocks", to: "/collections/granite" },
                    { label: "Vitrified Tiles", to: "/collections/vitrified_tiles" },
                    { label: "Ceramic Tiles", to: "/collections/ceramic_tiles" },
                    { label: "Sanitary", to: "/collections/sanitary" },
                ],
            },
            {
                label: "Applications",
                dropdownKey: "applications",
                items: [
                    { label: "Marble For Flooring", to: "/applications/flooring" },
                    { label: "Marble For Wall", to: "/applications/wall" },
                    { label: "Marble For Kitchen", to: "/applications/kitchen" },
                    { label: "Marble For Stairs", to: "/applications/stairs" },
                    { label: "Marble For Bathroom", to: "/applications/bathroom" },
                ],
            }
        ];
    }, []);

    const handleLogout = async() => {
        try {
            const { data } = await axios.get("/api/users/logout");
            console.log(data);
            if (data.success) {
                toast.success(data.message)
                setUser(null)
                navigate('/')
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (typeof searchQuery === "string" && searchQuery.length > 0) {
            navigate("/products");
        }
    }, [searchQuery]);

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
            <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-4 flex items-center justify-between gap-6">
                <NavLink to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                    <img className="h-10 md:h-12" src={assets.logo} alt="Logo" />
                </NavLink>

                <div className="hidden lg:flex items-center gap-7 text-[13px] tracking-[0.18em] uppercase text-gray-900">
                    {navLinks.map((l) => {
                        if (l.items) {
                            const isOpen = openDropdown === l.dropdownKey;
                            return (
                                <div
                                    key={l.label}
                                    className="relative"
                                    onMouseEnter={() => setOpenDropdown(l.dropdownKey)}
                                    onMouseLeave={() => setOpenDropdown(null)}
                                >
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 hover:text-black transition"
                                        aria-haspopup="menu"
                                        aria-expanded={isOpen}
                                    >
                                        {l.label}
                                        <span className="text-[10px] opacity-70">▼</span>
                                    </button>

                                    {isOpen && (
                                        <div className="absolute left-0 top-[calc(100%+14px)] w-64 bg-white border border-gray-200 shadow-lg">
                                            <div className="py-2">
                                                {l.items.map((it) => (
                                                    <NavLink
                                                        key={it.label}
                                                        to={it.to}
                                                        className="block px-4 py-2 text-[12px] tracking-[0.12em] uppercase text-gray-800 hover:bg-gray-50 hover:text-black transition"
                                                    >
                                                        {it.label}
                                                    </NavLink>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <NavLink
                                key={l.label}
                                to={l.to}
                                className={({ isActive }) =>
                                    `hover:text-black transition ${isActive ? "text-black font-semibold" : ""}`
                                }
                            >
                                {l.label}
                            </NavLink>
                        );
                    })}
                </div>

                <div className="hidden md:flex items-center gap-3">
                    <div className="hidden xl:flex items-center text-sm gap-2 border border-gray-300 px-3 h-10">
                        <input
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-52 bg-transparent outline-none placeholder-gray-500 text-sm"
                            type="text"
                            placeholder="Search"
                        />
                        <img src={assets.search_icon} alt="Search" className="w-4 h-4 opacity-70" />
                    </div>

                    <button
                        onClick={() => setShowEnquiry(true)}
                        className="h-10 px-5 border border-gray-900 text-gray-900 text-xs tracking-[0.2em] uppercase hover:bg-gray-900 hover:text-white transition"
                    >
                        Get a Quote
                    </button>

                    <button onClick={() => navigate("/cart")} className="relative h-10 w-10 grid place-items-center border border-gray-200 hover:border-gray-400 transition">
                        <img src={assets.nav_cart_icon} alt="Cart" className="w-5 opacity-80" />
                        <span className="absolute -top-2 -right-2 text-[11px] text-white bg-black w-[18px] h-[18px] rounded-full grid place-items-center">
                            {getCartCount()}
                        </span>
                    </button>

                    <NotificationBell />

                    {!user ? (
                        <button
                            onClick={() => setShowUserLogin(true)}
                            className="h-10 px-5 bg-black text-white text-xs tracking-[0.2em] uppercase hover:bg-gray-900 transition"
                        >
                            Login
                        </button>
                    ) : (
                        <div className="relative group">
                            <img src={assets.profile_icon} alt="UserProfile" className="w-10 h-10 rounded-full border border-gray-200" />
                            <ul className="hidden group-hover:block absolute top-11 right-0 bg-white shadow-lg border border-gray-200 py-2 text-sm w-36 z-40">
                                <li onClick={() => navigate("/my-orders")} className="hover:bg-gray-100 py-2 px-4 block cursor-pointer">
                                    My bookings
                                </li>
                                <li onClick={handleLogout} className="hover:bg-gray-100 py-2 px-4 block cursor-pointer">
                                    Logout
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Keep Seller button in navbar */}
                    <NavLink
                        className="h-10 inline-flex items-center px-5 border border-[#d7a74a] text-[#9a6c15] text-xs tracking-[0.2em] uppercase hover:bg-[#d7a74a] hover:text-black transition"
                        to="/seller"
                    >
                        Seller
                    </NavLink>
                </div>

                <div className="flex items-center gap-3 md:hidden">
                    <button
                        onClick={() => setShowEnquiry(true)}
                        className="h-10 px-4 border border-gray-900 text-gray-900 text-xs tracking-[0.2em] uppercase"
                    >
                        Quote
                    </button>
                    <button onClick={() => navigate("/cart")} className="relative h-10 w-10 grid place-items-center border border-gray-200">
                        <img src={assets.nav_cart_icon} alt="Cart" className="w-5 opacity-80" />
                        <span className="absolute -top-2 -right-2 text-[11px] text-white bg-black w-[18px] h-[18px] rounded-full grid place-items-center">
                            {getCartCount()}
                        </span>
                    </button>
                    <button onClick={() => setOpen((s) => !s)} aria-label="Menu" className="h-10 w-10 grid place-items-center border border-gray-200">
                        <img src={assets.menu_icon} alt="menu" className="w-6" />
                    </button>
                </div>
            </div>

            {open && (
                <div className="lg:hidden border-t border-gray-200 bg-white px-6 md:px-16 py-4">
                    <div className="flex flex-col gap-3 text-sm">
                        {navLinks.map((l) => {
                            if (!l.items) {
                                return (
                                    <NavLink key={l.label} to={l.to} onClick={() => setOpen(false)} className="py-1">
                                        {l.label}
                                    </NavLink>
                                );
                            }

                            return (
                                <div key={l.label} className="pt-2">
                                    <p className="text-xs tracking-[0.2em] uppercase text-gray-500">{l.label}</p>
                                    <div className="mt-2 flex flex-col gap-2 pl-3">
                                        {l.items.map((it) => (
                                            <NavLink key={it.label} to={it.to} onClick={() => setOpen(false)} className="py-1 text-gray-800">
                                                {it.label}
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        <NavLink to="/seller" onClick={() => setOpen(false)} className="py-1 font-semibold text-[#9a6c15]">
                            Seller
                        </NavLink>

                        {user && (
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-xs text-gray-500 uppercase tracking-wider">Notifications</span>
                                <NotificationBell />
                            </div>
                        )}

                        {!user ? (
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    setShowUserLogin(true);
                                }}
                                className="mt-2 h-10 bg-black text-white text-xs tracking-[0.2em] uppercase"
                            >
                                Login
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        navigate("/my-orders");
                                    }}
                                    className="mt-2 h-10 w-full border border-gray-300 text-xs tracking-[0.2em] uppercase"
                                >
                                    My bookings
                                </button>
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        handleLogout();
                                    }}
                                    className="mt-2 h-10 bg-black text-white text-xs tracking-[0.2em] uppercase w-full"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
