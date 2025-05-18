// pages/HomePage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router';
import Pagination from '../components/Pagination.jsx';
import SelectField from '../components/SelectField.jsx';
import SearchField from '../components/SearchField.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ArticleCard from './../components/ArticleCard.jsx';
// import { useConfig } from '../context/ConfigContext.jsx';
import { toast } from 'react-toastify';
import { useDB } from './../context/DbContext.jsx';

function HomePage() {
    // const { dbUrl, isProd } = useConfig();

    const { loading, listArticles, listArticlesFiltered } = useDB(); // Get the authenticated user from the DB context

    // State to store all articles
    const [articles, setArticles] = useState([]);
    // State to manage URL search parameters
    const [searchParams, setSearchParams] = useSearchParams();
    // Reference for the search input field
    const searchInputRef = useRef(null);
    // State to manage loading status
    const [isLoading, setLoading] = useState(true);

    // Initial values for filters and pagination from URL parameters
    const initialPage = parseInt(searchParams.get('page')) || 1;
    const initialSearch = searchParams.get('search') || '';
    const initialCategory = searchParams.get('category') || '';

    // State for search, category filter, and current page
    const [search, setSearch] = useState(initialSearch);
    const [category, setCategory] = useState(initialCategory);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [view, setView] = useState([]);
    const articlesPerPage = 10; // Number of articles per page

    // Fetch all articles from the server
    useEffect(() => {
        async function fetchArticles() {
            try {
                const articleList = await listArticles(); // Fetch articles from the DB context               
                setArticles(articleList);
            } catch (error) {
                toast.error('Error fetching articles:', error); // Log any errors
            }
        }
        fetchArticles();
    }, []);

    // Filter articles based on search and category
    // const filtered = articles
    //     .filter(a => a.title.toLowerCase().includes(search.toLowerCase())) // Filter by title
    //     .filter(a => (category ? a.category === category : true)); // Filter by category


    useEffect(() => {
        async function filterArticles() {
            return await listArticles({ category, title: search });
        }
        setLoading(true);
        filterArticles().then((filteredArticles) => {
            setLoading(false);
            debugger
            setView(filteredArticles);
        });

    }, [category, search, articles, currentPage]);

    // Calculate pagination details
    const totalPages = Math.max(1, Math.ceil(view.length / articlesPerPage)); // Total pages
    const indexOfLast = currentPage * articlesPerPage; // Index of the last article on the current page
    const indexOfFirst = indexOfLast - articlesPerPage; // Index of the first article on the current page
    const currentArticles = view.slice(indexOfFirst, indexOfLast); // Articles for the current page

    // Reset current page if it exceeds the total pages after filtering
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    // Sync URL parameters with the current state
    useEffect(() => {
        const params = {};
        if (search) params.search = search; // Add search to URL if not empty
        if (category) params.category = category; // Add category to URL if not empty
        if (currentPage !== 1) params.page = currentPage; // Add page to URL if not the first page
        setSearchParams(params, { replace: true }); // Update URL without adding to history
    }, [search, category, currentPage, setSearchParams]);

    // Reset all filters and focus on the search input
    const resetFilters = () => {
        setSearch('');
        setCategory('');
        setCurrentPage(1);
        searchInputRef.current?.focus(); // Focus on the search input field
    };
    console.log(`loaidng: ${loading}`)
    // Show loading spinner while articles are being fetched
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner message="Artikel werden geladen..." size="lg" />
            </div>
        );
    }
    // console.log(`view: ${currentArticles.length}`)
    // console.log(`totalpages: ${totalPages}`);
    // console.log(`currentpage: ${currentPage}`);

    return (
        <div className="space-y-4">
            {/* Filter bar */}
            <div className="flex flex-col md:flex-row md:items-end gap-x-8 mb-6">
                {/* Search field */}
                <div className="flex">
                    <SearchField
                        label="Suche nach Titel"
                        value={search}
                        onChange={val => setSearch(val)} // Update search state on change
                        onEnter={val => setSearch(val)} // Update search state on Enter key press
                        delay={300} // Debounce delay
                        ref={searchInputRef} // Reference for resetting focus
                    />
                </div>
                {/* Category filter */}
                <div className="flex mt-5 md:m-0">
                    <SelectField
                        label="Kategorie"
                        value={category}
                        onChange={e => setCategory(e.target.value)} // Update category state on change
                        options={[
                            { label: 'Alle', value: '' },
                            { label: 'Telekommunikation', value: 'Telecommunications' },
                            { label: 'KI & Maschinelles Lernen', value: 'AI & Machine Learning' },
                            { label: 'Sicherheit', value: 'Security' },
                            { label: 'Robotik', value: 'Robotics' },
                            { label: 'Cybersicherheit', value: 'Cybersecurity' },
                            { label: 'Wearables', value: 'Wearables' },
                            { label: 'Smart Home', value: 'Smart Home' },
                            { label: 'Drohnen', value: 'Drones' },
                            { label: 'Quantencomputing', value: 'Quantum Computing' },
                            { label: 'Virtuelle Realität', value: 'Virtual Reality' },
                            { label: 'Internet der Dinge', value: 'IoT' },
                            { label: 'Blockchain', value: 'Blockchain' },
                            { label: 'Augmented Reality', value: 'Augmented Reality' },
                            { label: 'Edge Computing', value: 'Edge Computing' },
                            { label: 'Autonome Fahrzeuge', value: 'Autonomous Vehicles' },
                            { label: 'Bildungstechnologie', value: 'Education Technology' },
                            { label: 'Cloud Computing', value: 'Cloud Computing' },
                            { label: 'Big Data', value: 'Big Data' }
                        ]}
                    />
                </div>
                {/* Reset filters button */}
                <div>
                    <button onClick={resetFilters} className="btn btn-outline mt-4 md:m-0">
                        Zurücksetzen
                    </button>
                </div>
            </div>

            {/* Pagination */}
            {(view && view.length > articlesPerPage) && (
                <Pagination
                    totalPages={totalPages} // Total pages
                    currentPage={currentPage} // Current page
                    onPageChange={setCurrentPage} // Update current page on change
                />
            )}

            {/* Articles grid */}
            <div className="grid md:grid-cols-2 gap-4 gap-x-12 animate-fade-in">
                {currentArticles.map(article => (
                    <ArticleCard key={article.id} article={article} /> // Render each article card
                ))}
            </div>


        </div>
    );
}

export default HomePage;
