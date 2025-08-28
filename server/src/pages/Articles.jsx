import { useState, useEffect } from "react";
import Pagination from "../components/ui/Pagination";
import SearchBar from "../components/ui/SearchBar";
import apiClient from "../services/apiClient";
import ArticlesCard from "../components/ui/ArticlesCard";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../services/apiClient";

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [categories, setCategories] = useState([]);
    const articlesPerPage = 6; // Change the number of articles per page to 6

    const location = useLocation();
    const navigate = useNavigate();


    const queryParams = new URLSearchParams(location.search);
    const categoryIdFromUrl = queryParams.get("category");

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                let response;
                if (categoryIdFromUrl) {

                    response = await apiClient.get(`/posts/category/${categoryIdFromUrl}`);
                    setArticles(Array.isArray(response.data) ? response.data : []);
                    setFilteredArticles(Array.isArray(response.data) ? response.data : []);
                    setSelectedCategory(categoryIdFromUrl);
                } else {
                    response = await apiClient.get("/posts");
                    setArticles(Array.isArray(response.data.posts) ? response.data.posts : []);
                    setFilteredArticles(Array.isArray(response.data.posts) ? response.data.posts : []);
                    setSelectedCategory("All");
                }
            } catch (error) {
                console.error("Error fetching articles:", error);
            }
        };

        fetchArticles();
        // eslint-disable-next-line
    }, [categoryIdFromUrl]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClient.get("/categories");
                setCategories(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    // Filter articles based on search term and category
    useEffect(() => {
        let result = articles;

        if (searchTerm) {
            result = result.filter(
                (article) =>
                    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredArticles(result);
        setCurrentPage(1); 
    }, [searchTerm, articles]);

    // Get current articles for pagination
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle search input
    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    // Handle category selection
    const handleCategoryChange = (category) => {
        navigate(`/articles?category=${category}`);
    };

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Articles</h1>
                <p className="text-gray-600">Discover the latest insights, tutorials, and news</p>
            </header>

            <div className="flex justify-center mb-12">
                <SearchBar onSearch={handleSearch} placeholder="Search article" />
            </div>

            {filteredArticles.length === 0 ? (
                <div className="text-center py-10">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">No approved articles available</h2>
                    <p className="text-gray-500">Please check back later or contact the administrator.</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-10 py-12 px-4 sm:px-6 lg:px-8">
                        {currentArticles.map((article) => {
                            const featuredImageUrl = article.featuredImage ? `${BASE_URL}/${article.featuredImage}` : "/placeholder.svg";
                            const avatarUrl = article.author?.avatar ? `${BASE_URL}${article.author.avatar}` : "/placeholder.svg";
                            return (
                                <ArticlesCard
                                    key={article._id || article.id}
                                    article={{
                                        id: article._id || article.id,
                                        title: article.title,
                                        excerpt: article.excerpt,
                                        tags: article.tags,
                                        category: article.category,
                                        author: article.author?.username,
                                        avatar: avatarUrl,
                                        image: featuredImageUrl,
                                        date: article.date || article.publishDate,
                                    }}
                                    onClick={() => navigate(`/posts/${article._id || article.id}`)}
                                />
                            );
                        })}
                    </div>

                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
                </>
            )}
        </div>
    );
};

export default Articles;