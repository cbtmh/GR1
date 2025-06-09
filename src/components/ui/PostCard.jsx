import { Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// PostCard.jsx - Hiển thị 1 bài post trong grid
const PostCard = ({ post }) => {
    const navigate = useNavigate();
    return (
        <article
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow h-full group flex flex-col cursor-pointer"
        >
            <div className="p-6 flex flex-col h-full flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex-1" />
                <div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        {/* Edit icon, chỉ hiện khi hover */}
                        <button
                            className="hidden group-hover:flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors mr-2"
                            title="Edit Post"
                            onClick={e => {
                                e.stopPropagation();
                                navigate(`/posts/${post._id}/edit`);
                            }}
                        >
                            <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                            className="text-blue-600 hover:text-blue-700 font-medium ml-auto group-hover:inline-block hidden"
                            onClick={e => {
                                e.stopPropagation();
                                navigate(`/posts/${post._id}`);
                            }}
                        >
                            Read More
                        </button>
                    </div>
                </div>
            </div>
            {/* Hiện action khi hover card */}
            <div className="absolute inset-0 group-hover:bg-black/5 transition pointer-events-none" />
        </article>
    );
};

export default PostCard;
