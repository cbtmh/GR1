import { Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import apiClient from "../../services/apiClient"; 


const PostCard = ({ post, onPostDelete }) => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth); 


    const isAuthor = user && post.author && (user.id === post.author._id || user._id === post.author._id || user.id === post.author);

    const handleDelete = async (e) => {
        e.stopPropagation(); 

        if (window.confirm("Do you want to delete this post? This action cannot be undone.")) {
            try {
                await apiClient.delete(`/posts/${post._id}`);
                alert("Delete successfully!");

                if (onPostDelete) {
                    onPostDelete(post._id);
                }
            } catch (error) {
                console.error("Error to delete this post", error);
                alert("Please try again!");
            }
        }
    };

    return (
        <article
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow h-full group flex flex-col cursor-pointer relative"
        >
            <div className="p-6 flex flex-col h-full flex-1" onClick={() => navigate(`/posts/${post._id}`)}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex-grow" />
                <div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Nút sửa, chỉ hiện cho tác giả */}
                            {isAuthor && (
                                <button
                                    className="flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors"
                                    title="Chỉnh sửa bài viết"
                                    onClick={e => {
                                        e.stopPropagation();
                                        navigate(`/posts/${post._id}/edit`);
                                    }}
                                >
                                    <Edit2 className="w-5 h-5" />
                                </button>
                            )}
                            {/* Nút xóa, chỉ hiện cho tác giả */}
                            {isAuthor && (
                                <button
                                    className="flex items-center justify-center text-gray-500 hover:text-red-600 transition-colors"
                                    title="Xóa bài viết"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <button
                            className="text-blue-600 hover:text-blue-700 font-medium ml-auto"
                            onClick={e => {
                                e.stopPropagation();
                                navigate(`/posts/${post._id}`);
                            }}
                        >
                            Đọc thêm
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default PostCard;
