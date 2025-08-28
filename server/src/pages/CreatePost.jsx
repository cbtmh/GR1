import { useState, useRef, useEffect } from "react"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { useNavigate } from "react-router-dom"; // <<<< IMPORT useNavigate
import { useSelector } from "react-redux"
const CreatePost = () => {
    const [postData, setPostData] = useState({
        title: "",
        content: "",
        excerpt: "",
        tags: [],
        category: "",
        featuredImage: null,
        status: "draft",
        publishDate: new Date().toISOString().split("T")[0],
    })

    const [tagInput, setTagInput] = useState("")
    const [isPreview, setIsPreview] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState({})
    const fileInputRef = useRef(null)
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate(); // <<<< KHỞI TẠO useNavigate

    const [categories, setCategories] = useState([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();

                // Đảm bảo luôn lấy đúng mảng category dù API trả về dạng nào
                setCategories(Array.isArray(data.categories) ? data.categories : (Array.isArray(data) ? data : []));
            } catch (err) {
                console.error("Error fetching categories:", err); // Log lỗi chi tiết
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    const handleInputChange = (field, value) => {
        setPostData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    const handleAddTag = (e) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault()
            if (!postData.tags.includes(tagInput.trim())) {
                handleInputChange("tags", [...postData.tags, tagInput.trim()])
            }
            setTagInput("")
        }
    }

    const handleRemoveTag = (tagToRemove) => {
        handleInputChange(
            "tags",
            postData.tags.filter((tag) => tag !== tagToRemove),
        )
    }

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            handleInputChange("featuredImage", file)
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!postData.title.trim()) {
            newErrors.title = "Title is required"
        }

        if (!postData.content.trim()) {
            newErrors.content = "Content is required"
        }

        if (!postData.category) {
            newErrors.category = "Category is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (status) => {
        const updatedPostData = { ...postData, status };
        setPostData(updatedPostData);

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('title', updatedPostData.title);
            formData.append('content', updatedPostData.content);
            formData.append('excerpt', updatedPostData.excerpt);
            formData.append('category', updatedPostData.category);
            formData.append('status', updatedPostData.status);
            formData.append('publishDate', updatedPostData.publishDate);
            if (user && (user._id || user.id)) {
                formData.append('author', user._id || user.id);
            }
            if (updatedPostData.featuredImage) {
                formData.append('featuredImage', updatedPostData.featuredImage);
            }
            updatedPostData.tags.forEach((tag) => {
                formData.append('tags[]', tag);
            });

            const response = await fetch('/api/posts', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Failed to create post');
            const data = await response.json();

            alert(`Post ${status === "published" ? "published" : "saved as draft"} successfully!`);

            if (status === "published") {
                navigate('/');
            } else {
                setPostData({
                    title: "",
                    content: "",
                    excerpt: "",
                    tags: [],
                    category: "",
                    featuredImage: null,
                    status: "draft",
                    publishDate: new Date().toISOString().split("T")[0],
                });
                setTagInput("");
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        } catch (error) {
            alert("Error submitting post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }
    // Hàm xử lý khi nhấn nút "Back to Homepage"
    const handleBackToHomepage = () => {
        if (user && (user.id || user._id)) {
            navigate(`/profile/${user.id}`);
        } else {
            console.error("User ID is undefined, cannot navigate to profile.");
            // Tùy chọn: có thể điều hướng về trang đăng nhập hoặc hiển thị thông báo lỗi
        }
    };


    if (isPreview) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-sm border p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Preview</h1>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleBackToHomepage} // <<<< THÊM CHO PREVIEW
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    Back to Profile Page
                                </button>
                                <button
                                    onClick={() => setIsPreview(false)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Back to Edit
                                </button>
                            </div>
                        </div>

                        <article className="prose prose-lg max-w-none">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{postData.title || "Untitled Post"}</h1>

                            {postData.featuredImage && (
                                <img
                                    src={URL.createObjectURL(postData.featuredImage) || "/placeholder.svg"}
                                    alt="Featured"
                                    className="w-full h-64 object-cover rounded-lg mb-6"
                                />
                            )}

                            {postData.excerpt && <p className="text-xl text-gray-600 italic mb-6">{postData.excerpt}</p>}

                            <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                                <span>Category: {postData.category || "Uncategorized"}</span>
                                <span>•</span>
                                <span>Publish Date: {postData.publishDate}</span>
                            </div>

                            {postData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {postData.tags.map((tag) => (
                                        <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{ __html: postData.content || "<p>No content yet...</p>" }}
                            />
                        </article>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-sm border">
                    {/* Header */}
                    <div className="border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3"> {/* <<<< Bọc tiêu đề và nút back */}
                                <button
                                    onClick={handleBackToHomepage}
                                    title="Back to Homepage"
                                    className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                    </svg>
                                </button>
                                <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsPreview(true)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    Preview
                                </button>
                                <button
                                    onClick={() => handleSubmit("draft")}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? "Saving..." : "Save Draft"}
                                </button>
                                <button
                                    onClick={() => handleSubmit("published")}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? "Publishing..." : "Publish"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={postData.title}
                                onChange={(e) => handleInputChange("title", e.target.value)}
                                placeholder="Enter your post title..."
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.title ? "border-red-300" : "border-gray-300"
                                    }`}
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                                Excerpt
                            </label>
                            <textarea
                                id="excerpt"
                                value={postData.excerpt}
                                onChange={(e) => handleInputChange("excerpt", e.target.value)}
                                placeholder="Brief description of your post..."
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Content Editor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                            <div className={`border rounded-md ${errors.content ? "border-red-300" : "border-gray-300"}`}>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={postData.content}
                                    onChange={(event, editor) => {
                                        const data = editor.getData()
                                        handleInputChange("content", data)
                                    }}
                                    config={{
                                        toolbar: [
                                            "heading",
                                            "|",
                                            "bold",
                                            "italic",
                                            "link",
                                            "bulletedList",
                                            "numberedList",
                                            "|",
                                            "outdent",
                                            "indent",
                                            "|",
                                            "imageUpload",
                                            "blockQuote",
                                            "insertTable",
                                            "mediaEmbed",
                                            "|",
                                            "undo",
                                            "redo",
                                        ],
                                    }}
                                />
                            </div>
                            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    id="category"
                                    value={postData.category}
                                    onChange={(e) => handleInputChange("category", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.category ? "border-red-300" : "border-gray-300"
                                        }`}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                            </div>

                            {/* Publish Date */}
                            <div>
                                <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Publish Date
                                </label>
                                <input
                                    type="date"
                                    id="publishDate"
                                    value={postData.publishDate}
                                    onChange={(e) => handleInputChange("publishDate", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div>
                            <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">
                                Featured Image
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    id="featuredImage"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {postData.featuredImage && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-green-600">✓ {postData.featuredImage.name}</span>
                                        <button
                                            onClick={() => {
                                                handleInputChange("featuredImage", null)
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = ""
                                                }
                                            }}
                                            className="text-sm text-red-600 hover:text-red-800"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    id="tags"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    placeholder="Type a tag and press Enter..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {postData.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {postData.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                            >
                                                #{tag}
                                                <button onClick={() => handleRemoveTag(tag)} className="ml-1 text-blue-600 hover:text-blue-800">
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePost