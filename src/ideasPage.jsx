import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 3;
        const halfPages = Math.floor(maxPagesToShow / 2);

        if (totalPages <= 5) { 
            for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
            return pageNumbers;
        }

        if (currentPage <= 3) {
            return [1, 2, 3, '...', totalPages];
        }

        if (currentPage >= totalPages - 2) {
            return [1, '...', totalPages - 2, totalPages - 1, totalPages];
        }
        
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

    return (
        <div className="flex justify-center items-center gap-2 mt-10">
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded border bg-white disabled:opacity-50"
            >
                «
            </button>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded border bg-white disabled:opacity-50"
            >
                ‹
            </button>
            {getPageNumbers().map((num, index) =>
                typeof num === 'number' ? (
                    <button
                        key={`${num}-${index}`}
                        onClick={() => onPageChange(num)}
                        className={`w-8 h-8 rounded ${currentPage === num ? 'bg-orange-500 text-white' : 'bg-white border'}`}
                    >
                        {num}
                    </button>
                ) : (
                    <span key={`dots-${index}`} className="px-2">...</span>
                )
            )}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded border bg-white disabled:opacity-50"
            >
                ›
            </button>
            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded border bg-white disabled:opacity-50"
            >
                »
            </button>
        </div>
    );
};

export default function IdeasPage() {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(() => Number(localStorage.getItem("page")) || 1);
    const [perPage, setPerPage] = useState(() => Number(localStorage.getItem("perPage")) || 10);
    const [sort, setSort] = useState(() => localStorage.getItem("sort") || "-published_at");
    const [totalItems, setTotalItems] = useState(0);
    const [scrollDir, setScrollDir] = useState("up");
    const bannerRef = useRef(null);
    const bannerTextRef = useRef(null);
    const lastScrollY = useRef(0);
    const location = useLocation();

    useEffect(() => {
        const fetchIdeas = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `/api/ideas`, 
                    {
                        params: {
                            "page[number]": page,
                            "page[size]": perPage,
                            'append[]': ["small_image", "medium_image"],
                            sort: sort,
                        },
                    }
                );
                if (Array.isArray(res.data.data)) {
                    setIdeas(res.data.data);
                } else {
                    setIdeas([]);
                }
                setTotalItems(res.data.meta.total);
            } catch (err) {
                console.error("Failed to fetch ideas", err);
                setIdeas([]);
            } finally {
                setLoading(false);
            }
        };
        fetchIdeas();
    }, [page, perPage, sort]);
    
    useEffect(() => {
        localStorage.setItem("page", String(page));
        localStorage.setItem("perPage", String(perPage));
        localStorage.setItem("sort", String(sort));
    }, [page, perPage, sort]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrollDir(currentScrollY > lastScrollY.current && currentScrollY > 100 ? "down" : "up");
            lastScrollY.current = currentScrollY;

            if (bannerRef.current) {
                bannerRef.current.style.backgroundPositionY = `${currentScrollY * 0.5}px`;
            }
            if (bannerTextRef.current) {
                bannerTextRef.current.style.transform = `translateY(${currentScrollY * 0.3}px)`;
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const totalPages = Math.ceil(totalItems / perPage);
    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return (
        <div className="min-h-screen bg-gray-50">
            <main>
                <div className="w-full relative overflow-hidden pt-15">
                    <div ref={bannerRef} className="h-96 bg-cover bg-center" style={{ backgroundImage: `url('/banner.jpeg')`, clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0% 100%)' }}>
                        <div className="h-full flex flex-col items-center justify-center bg-black/60 text-center">
                            <h1 ref={bannerTextRef} className="text-5xl font-bold text-white">Ideas</h1>
                            <p className="text-white text-lg mt-2">Where all our great things begin</p>
                        </div>
                    </div>
                </div>
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-wrap justify-between items-center my-6 gap-4">
                        <p>Showing {(page - 1) * perPage + 1} - {Math.min(page * perPage, totalItems)} of {totalItems}</p>
                        <div className="flex flex-wrap gap-4">
                            <label className="flex items-center">
                                Show per page:
                                <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }} className="ml-2 border rounded p-1">
                                    {[10, 20, 50].map((size) => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="flex items-center">
                                Sort by:
                                <select value={sort} onChange={(e) => setSort(e.target.value)} className="ml-2 border rounded p-1">
                                    <option value="-published_at">Newest</option>
                                    <option value="published_at">Oldest</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {Array.from({ length: perPage }).map((_, idx) => (
                                <div key={idx} className="animate-pulse bg-white rounded-lg p-4">
                                    <div className="w-full h-48 bg-gray-300 rounded mb-4"></div>
                                    <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {ideas.map((item) => (
                                <div key={item.id} className="bg-white rounded-lg overflow-hidden flex flex-col group shadow hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer">
                                    <img src={`https://placehold.co/400x225?text=ID+${item.id}`} loading="lazy" alt={item.title} className="w-full aspect-video object-cover bg-gray-200" />
                                    <div className="p-4 flex flex-col flex-grow">
                                        <p className="text-sm text-gray-500 mb-2">{new Date(item.published_at).toLocaleDateString("id-ID", dateOptions)}</p>
                                        <h3 className="text-lg font-semibold leading-snug line-clamp-3 flex-grow">{item.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {totalPages > 1 && (
                        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                    )}
                </div>
            </main>
        </div>
    );
}