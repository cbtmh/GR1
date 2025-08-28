
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import apiClient from "../services/apiClient";
import { useSelector } from "react-redux";
import { BASE_URL } from "../services/apiClient";
const EditPost = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        title: "",
        excerpt: "",
        content: "",
        currentFeaturedImage: "",
    });
    const { user } = useSelector((state) => state.auth);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await apiClient.get(`/posts/${id}`);
                setForm({
                    title: res.data.title,
                    excerpt: res.data.excerpt,
                    content: res.data.content,
                    currentFeaturedImage: res.data.featuredImage,
                });
            } catch (err) {
                setError("Không thể tải bài viết");
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchPost();
        }
    }, [id]); 

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleContentChange = (event, editor) => {
        setForm({ ...form, content: editor.getData() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("excerpt", form.excerpt);
        formData.append("content", form.content);
        if (imageFile) {
            formData.append("featuredImage", imageFile);
        }

        try {
            await apiClient.put(`/posts/${id}`, formData); 
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
                if (user?._id) {
                    navigate(`/profile/${user._id}`);
                } else {
                    navigate('/');
                }
            }, 3000);
        } catch (err) {
            setError("Cập nhật thất bại");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    const currentImageUrl = form.currentFeaturedImage ? `${BASE_URL}/${form.currentFeaturedImage}` : null;
    if (loading) return <div className="p-8 text-center">Đang tải...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <>
        {showSuccessMessage && (
            <div className="fixed bottom-5 right-5 bg-green-600 text-white py-3 px-6 rounded-lg shadow-xl animate-fade-in-up">
                Update successfully! The post is now pending admin approval.
            </div>
        )}

        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
            <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Excerpt</label>
                    <textarea
                        name="excerpt"
                        value={form.excerpt}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                        rows={2}
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Content</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={form.content}
                        onChange={handleContentChange}
                    />
                </div>
                <div>
                        <label className="block font-medium mb-1">Featured Image</label>
                        <div className="mt-2 flex items-center gap-4">
                            <div className="w-48 h-28 rounded-md overflow-hidden bg-gray-100 border">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : currentImageUrl ? (
                                    <img src={currentImageUrl} alt="Current" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="flex items-center justify-center h-full text-gray-400 text-sm">No Image</span>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                    </div>
                {error && <div className="text-red-500">{error}</div>}
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
         </>
    );
};

export default EditPost;