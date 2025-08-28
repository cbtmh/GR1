import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient, { BASE_URL } from "../services/apiClient";
import { useAuth } from "../services/authContext";
import { useNavigate } from "react-router-dom";

const PostDetail = () => {
    const { id: postId } = useParams();
    const { currentUser } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchAllData = async () => {
            try {
                // 1. Fetch the main post details
                const postResponse = await apiClient.get(`/posts/${postId}`);
                const currentPost = postResponse.data;
                setPost(currentPost);

                // 2. Fetch comments for the post
                const commentsResponse = await apiClient.get(`/comments?postId=${postId}`);
                setComments(commentsResponse.data.comments);

                // 3. Fetch related posts based on the current post's category
                if (currentPost?.category?._id) {
                    const relatedPostsResponse = await apiClient.get(`/posts/category/${currentPost.category._id}`);
                    // Filter out the current post from the related posts list
                    const filteredRelatedPosts = relatedPostsResponse.data.filter(p => p._id !== currentPost._id);
                    setRelatedPosts(filteredRelatedPosts);
                } else {
                    setRelatedPosts([]); // Reset related posts if no category
                }

            } catch (error) {
                console.error("Error fetching post data:", error);
                setPost(null); // Reset post on error
            }
        };

        if (postId) {
            fetchAllData();
        }

    }, [postId]); // The effect now ONLY depends on postId

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const commentContent = e.target.comment.value;

        if (!commentContent.trim()) {
            alert("Comment cannot be empty!");
            return;
        }

        if (!currentUser || typeof currentUser.id !== "string" || !currentUser.id.trim()) {
            alert("You must be logged in to comment.");
            return;
        }

        try {
            const response = await apiClient.post("/comments", {
                postId: postId,
                content: commentContent,
                author: currentUser.id,
            });

            setComments((prevComments) => [...prevComments, response.data.comment]);
            e.target.reset();
        } catch (error) {
            console.error("Error submitting comment:", error);
            if (error.response && error.response.data) {
                console.error("Backend error details:", error.response.data);
            }
            alert("Failed to submit comment. Please try again.");
        }
    };

    const handleRelatedPostClick = (relatedPostId) => {
        navigate(`/posts/${relatedPostId}`);
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    const featuredImageUrl = post.featuredImage
        ? `${BASE_URL}/${post.featuredImage}`
        : "/placeholder.svg";

    return (
        <div className="bg-gray-50">
            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-8">
                {/* Breadcrumb */}
                <nav className="flex mb-8 text-sm">
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                        Home
                    </a>
                    <span className="mx-2 text-gray-500">/</span>
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                        {post.category.name}
                    </a>
                    <span className="mx-2 text-gray-500">/</span>
                    <span className="text-gray-500">Post</span>
                </nav>

                {/* Article Header */}
                <article className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-8">
                        {/* Category and Meta */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                {post.category.name}
                            </span>
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                                <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{post.readTime || "5 min read"}</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                            {post.title}
                        </h1>

                        {/* Excerpt */}
                        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                            {post.excerpt}
                        </p>

                        {/* Author Info */}
                        <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
                            <div className="flex items-center">
                                <img
                                    src={`${BASE_URL}${post.author.avatar}` || "/placeholder.svg"}
                                    alt={post.author.username}
                                    className="w-12 h-12 rounded-full mr-4"
                                />

                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {post.author.username}
                                    </h3>
                                    <p className="text-sm text-gray-600">{post.author.email}</p>
                                </div>
                            </div>

                        </div>

                        {/* Featured Image */}
                        <div className="mb-8">
                            <img
                                src={featuredImageUrl}
                                alt={post.title}
                                className="w-full h-64 md:h-96 object-cover rounded-lg"
                            />
                        </div>

                        {/* Article Content */}
                        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

                        {/* Tags */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </article>

                {/* Comments Section */}
                <section className="mt-12 bg-white rounded-lg shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h2>

                    {/* Comment Form */}
                    <div className="mb-8">
                        <form onSubmit={handleCommentSubmit}>
                            <textarea
                                name="comment"
                                placeholder="Share your thoughts..."
                                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={4}
                            />
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Post Comment
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-6">
                        {comments.map((comment) => (
                            <div key={comment._id} className="border-b border-gray-200 pb-6">
                                <div className="flex items-start space-x-4">
                                    <img
                                        src={`${BASE_URL}${comment.author.avatar}` || "/placeholder.svg"}
                                        alt={comment.author.username}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <h4 className="font-semibold text-gray-900">{comment.author.username}</h4>
                                            <span className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p className="text-gray-700">{comment.content}</p>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Posts</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {relatedPosts.map((relatedPost) => (
                                <article
                                    key={relatedPost._id}
                                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => handleRelatedPostClick(relatedPost._id)}
                                >
                                    <img
                                        src={relatedPost.featuredImage ? `${BASE_URL}/${relatedPost.featuredImage}` : "/placeholder.svg"}
                                        alt={relatedPost.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-6">
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{relatedPost.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{relatedPost.excerpt}</p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>{new Date(relatedPost.publishDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default PostDetail;