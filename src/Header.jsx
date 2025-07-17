import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
const location = useLocation();
const menuItems = [
    { name: 'Work', path: '/work' },
    { name: 'About', path: '/about' },
    { name: 'Ideas', path: '/ideas' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' },
];

return (
    <header className="fixed top-0 left-0 w-full bg-orange-500 z-50 shadow-md">
    <nav className="flex justify-between items-center max-w-screen-xl mx-auto px-4 h-20">
        <Link to="/">
            <img src="/suitmedialogo.png" alt="Suitmedia Logo" className="h-40 w-auto" />
        </Link>
        <ul className="flex gap-8">
        {menuItems.map(item => (
            <li key={item.name} className="relative">
            <Link
                to={item.path}
                className="text-white text-sm tracking-wider"
            >
                {item.name}
            </Link>
            {location.pathname === item.path && (
                <span className="absolute left-0 -bottom-2 w-full h-0.5 bg-white"></span>
            )}
            </li>
        ))}
        </ul>
    </nav>
    </header>
);
}