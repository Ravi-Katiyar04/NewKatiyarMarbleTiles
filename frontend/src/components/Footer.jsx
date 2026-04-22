import React from 'react'
import { NavLink } from "react-router-dom";
import { assets , footerLinks} from '../assets/assets'
const Footer = () => {

    return (
        <footer className="px-4 md:px-16 lg:px-24 xl:px-32 bg-white border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-12 text-gray-600">
                <div>
                    <img className="h-12" src={assets.logo} alt="Logo" />
                    <p className="max-w-[420px] mt-6 text-sm leading-relaxed">
                        Premium marble, granite, tiles and sanitaryware for residential and commercial projects. Get expert guidance, transparent pricing and reliable delivery.
                    </p>

                    <div className="mt-6 space-y-2 text-sm">
                        <p>
                            <span className="text-gray-500 text-xs tracking-[0.2em] uppercase">Phone</span>
                            <span className="ml-3 text-gray-800 font-semibold">+91 8445273731</span>
                        </p>
                        <p>
                            <span className="text-gray-500 text-xs tracking-[0.2em] uppercase">Email</span>
                            <span className="ml-3 text-gray-800 font-semibold">new_katiyar_marble_tiles@gmail.com</span>
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {footerLinks.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-sm tracking-[0.2em] uppercase text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <NavLink to={link.url} className="hover:text-black transition">{link.text}</NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <div className="border-t border-gray-200 py-5 text-center text-xs tracking-[0.18em] uppercase text-gray-500">
                Copyright {new Date().getFullYear()} © NewKatiyarMarbleTiles.dev All Right Reserved.
            </div>
        </footer>
    );
}

export default Footer
