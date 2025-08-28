import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "../components/ui/CategoryCard";
import SearchBar from "../components/ui/SearchBar";
import apiClient from '../services/apiClient';

const Categories = ({ onCategorySelect }) => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [featuredCategories, setFeaturedCategories] = useState([]);
    const [regularCategories, setRegularCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const navigate = useNavigate();

    // Fetch categories from API on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClient.get('/categories');
                const data = Array.isArray(response.data.categories) ? response.data.categories : [];
                setCategories(data);
                setFilteredCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
                setFilteredCategories([]);
            }
        };

        fetchCategories();
    }, []); // Mảng dependency rỗng đảm bảo useEffect này chỉ chạy một lần khi component mount

    // Filter categories based on search term
    useEffect(() => {
        // Đảm bảo categories là một mảng trước khi lọc
        const sourceCategories = Array.isArray(categories) ? categories : [];
        if (searchTerm) {
            const filtered = sourceCategories.filter(
                (category) =>
                    // Kiểm tra category.name tồn tại và là chuỗi trước khi gọi toLowerCase()
                    (category.name && String(category.name).toLowerCase().includes(searchTerm.toLowerCase())) ||
                    // Kiểm tra category.description tồn tại và là chuỗi trước khi gọi toLowerCase()
                    (category.description && String(category.description).toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredCategories(filtered);
        } else {
            setFilteredCategories(sourceCategories);
        }
    }, [searchTerm, categories]);


    useEffect(() => {

        setFeaturedCategories(filteredCategories.filter((category) => category.featured));
        setRegularCategories(filteredCategories.filter((category) => !category.featured));
    }, [filteredCategories]);


    // Handle search input
    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    return (
        <div className="container py-12 px-4 sm:px-6 lg:px-8">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Categories</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Explore our collection of articles organized by topic. Find the content that interests you the most.
                </p>
            </header>

            <div className="max-w-md mx-auto mb-6 flex items-center gap-4">
                <select
                    className="border border-gray-300 rounded-md px-4 h-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedCategory}
                    onChange={e => {
                        setSelectedCategory(e.target.value);
                        if (e.target.value === "All") {
                            setFilteredCategories(categories);
                        } else {
                            setFilteredCategories(categories.filter(cat => cat._id === e.target.value));
                        }
                    }}
                >
                    <option value="All">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>
                <SearchBar onSearch={handleSearch} placeholder="Search category" />
            </div>

            {filteredCategories.length === 0 ? (
                <div className="text-center py-10">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">No categories found</h2>
                    <p className="text-gray-500">
                        {searchTerm ? "Try adjusting your search criteria" : "Please check back later."}
                    </p>
                </div>
            ) : (
                <>
                    {/* Featured Categories Section */}
                    {featuredCategories.length > 0 && (
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Categories</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {featuredCategories.map((category) => (
                                    <CategoryCard
                                        key={category._id}
                                        category={category}
                                        featured={true}
                                        onSelect={() => {
                                            navigate(`/articles?category=${category._id}`)
                                        }}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Regular Categories Section */}
                    {regularCategories.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                {featuredCategories.length > 0 ? "Other Categories" : "All Categories"}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {regularCategories.map((category) => (
                                    <CategoryCard
                                        key={category._id}
                                        category={category}
                                        featured={false}
                                        onSelect={() => navigate(`/articles?category=${category._id}`)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
};

export default Categories;