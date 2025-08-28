import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import apiClient, { BASE_URL } from "../services/apiClient";
import ArticlesCard from "../components/ui/ArticlesCard";

const Home = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsResponse = await apiClient.get("/posts");
        const categoriesResponse = await apiClient.get("/categories");
        setBlogPosts(postsResponse.data.posts || []);
        setCategories(categoriesResponse.data.categories || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const featuredPost = Array.isArray(blogPosts) ? blogPosts.find((post) => post.featured) : null;

  // Sắp xếp các bài viết theo ngày mới nhất và lấy 3 bài gần nhất
  const sortedPosts = Array.isArray(blogPosts)
    ? [...blogPosts]
      .filter((post) => !post.featured)
      .sort((a, b) => new Date(b.date || b.publishDate) - new Date(a.date || a.publishDate))
    : [];
  const recentPosts = sortedPosts.slice(0, 3);

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed with email: ${email}`);
    setEmail("");
  };

  const safeCategories = Array.isArray(categories) ? categories : [];

  const handlePostClick = (postId) => {
    if (!postId) {
      console.error("Post ID is undefined, cannot navigate to PostDetail.");
      return;
    }
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Featured Post */}
      <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Welcome to Our Blog
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Discover the latest insights, tutorials, and news about web development.
            </p>
          </div>

          {featuredPost && (
            <div className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden lg:flex">
              <div className="lg:w-1/2">
                <img
                  src={featuredPost.featuredImage ? `/uploads/${featuredPost.featuredImage}` : "/placeholder.svg"}
                  alt={featuredPost.title}
                  className="h-64 w-full object-cover lg:h-full"
                />
              </div>
              <div className="p-8 lg:w-1/2">
                <ArticlesCard
                  article={{
                    id: featuredPost._id || featuredPost.id,
                    title: featuredPost.title,
                    excerpt: featuredPost.excerpt,
                    tags: featuredPost.tags,
                    category: featuredPost.category,
                    author: featuredPost.author?.username || (typeof featuredPost.author === 'string' ? featuredPost.author : ''),
                    avatar: featuredPost.author?.avatar ? `${BASE_URL}${featuredPost.author.avatar}` : "/placeholder.svg",
                    image: featuredPost.featuredImage ? `${BASE_URL}/${featuredPost.featuredImage}` : "/placeholder.svg",
                    date: featuredPost.date || featuredPost.publishDate,
                  }}
                  onClick={() => handlePostClick(featuredPost._id || featuredPost.id)}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Recent Posts</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <ArticlesCard
                key={post._id || post.id}
                article={{
                  id: post._id || post.id,
                  title: post.title,
                  excerpt: post.excerpt,
                  tags: post.tags,
                  category: post.category,
                  author: post.author?.username || (typeof post.author === 'string' ? post.author : ''),
                  avatar: post.author?.avatar ? `${BASE_URL}${post.author.avatar}` : "/placeholder.svg",
                  image: post.featuredImage ? `${BASE_URL}/${post.featuredImage}` : "/placeholder.svg",
                  date: post.date || post.publishDate,
                }}
                onClick={() => handlePostClick(post._id || post.id)}
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <button
              className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => navigate("/articles")}
            >
              View All Posts
            </button>
          </div>
        </div>
      </section>


      {/* Call to Action */}
      {!isAuthenticated && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Ready to start your blogging journey?</h2>
            <p className="mt-4 text-xl text-gray-600">
              Join our community of writers and share your knowledge with the world.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Account
              </button>
              <button 
              onClick={() => navigate("/about")}
              className="px-8 py-3 bg-white text-indigo-600 font-medium rounded-md border border-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                About Us
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
