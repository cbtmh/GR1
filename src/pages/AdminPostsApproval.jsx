import React, { useState, useEffect } from "react"
import apiClient from "../services/apiClient"

const AdminPostsApproval = () => {
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Redirect to login if no admin user
  useEffect(() => {
    const adminUser = localStorage.getItem("adminUser")
    if (!adminUser) {
      window.location.href = "/admin/login"
    }
  }, [])

  // Fetch all posts for admin
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await apiClient.get("/posts/all")
        setPosts(res.data || [])
      } catch (err) {
        setError("Failed to load posts")
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  // Approve a post
  const handleApprove = async (postId) => {
    try {
      await apiClient.put(`/posts/${postId}/approve`)
      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? { ...post, approved: 'approved' } : post)),
      )
      if (selectedPost?._id === postId) {
        setSelectedPost((prev) => (prev ? { ...prev, approved: 'approved' } : null))
      }
    } catch (err) {
      alert("Approve failed")
    }
  }

  const handleReject = async (postId) => {
    try {
      // Gọi API endpoint mới
      await apiClient.put(`/posts/${postId}/reject`);
      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? { ...post, approved: 'rejected' } : post)),
      );
      if (selectedPost?._id === postId) {
        setSelectedPost((prev) => (prev ? { ...prev, approved: 'rejected' } : null));
      }
    } catch (err) {
      alert("Reject failed");
    }
  };

  // Filter posts based on search, category, and status
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      (post.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.author?.username || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || (post.category?.name || post.category) === filterCategory
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "pending" && post.approved === 'pending') ||
      (filterStatus === "approved" && post.approved === 'approved') ||
      (filterStatus === "rejected" && post.approved === 'rejected'); // Thêm điều kiện cho trạng thái 'rejected'
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get color classes for status
  const getStatusColor = (status) => {
    if (status === 'approved') return "bg-green-100 text-green-800";
    if (status === 'pending') return "bg-yellow-100 text-yellow-800";
    if (status === 'rejected') return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  // Get unique categories for filter dropdown
  const categories = React.useMemo(
    () => [
      "all",
      ...Array.from(new Set(posts.map((p) => p.category?.name).filter(Boolean))),
    ],
    [posts],
  )
  const pendingCount = posts.filter((p) => p.approved === 'pending').length

  // Handlers for filter changes
  const handleSearchChange = (e) => setSearchTerm(e.target.value)
  const handleCategoryChange = (e) => setFilterCategory(e.target.value)
  const handleStatusChange = (e) => setFilterStatus(e.target.value)

  // Handler for selecting a post
  const handleSelectPost = (post) => setSelectedPost(post)

  // Handler for quick action buttons (stop event propagation)
  const handleQuickApprove = (e, postId) => {
    e.stopPropagation()
    handleApprove(postId)
  }
  const handleQuickReject = (e, postId) => {
    e.stopPropagation()
    handleReject(postId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Post Management</h1>
              <p className="mt-1 text-sm text-gray-500">Review and approve posts for publication</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                {pendingCount} Pending Review
              </div>
              {/* Logout button */}
              <button
                onClick={() => {
                  localStorage.removeItem("adminUser")
                  window.location.href = "/admin/login"
                }}
                className="ml-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium shadow-sm border border-gray-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && <div className="text-center text-gray-500">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Post List */}
          <div className="lg:w-1/2">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filterCategory}
                    onChange={handleCategoryChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={handleStatusChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Post List */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className={`bg-white rounded-lg shadow-sm border transition-all hover:shadow-md ${selectedPost?._id === post._id ? "ring-2 ring-blue-500 border-blue-500" : ""
                    }`}
                >
                  <div onClick={() => handleSelectPost(post)} className="p-6 cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{post.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.approved)}`}>
                        {post.approved}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.excerpt}</p>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>By {post.author?.username || "Unknown"}</span>
                        <span>{post.category?.name || ""}</span>
                      </div>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {(post.tags || []).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions - Show when post is selected and pending */}
                  {selectedPost?._id === post._id && post.approved === 'pending' && (
                    <div className="border-t bg-blue-50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900">Take Action:</span>
                        <div className="flex space-x-3">
                          <button
                            onClick={(e) => handleQuickApprove(e, post._id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={(e) => handleQuickReject(e, post._id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium flex items-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status message for non-pending posts when selected */}
                  {selectedPost?._id === post._id && post.approved && (
                    <div className="border-t bg-gray-50 p-4">
                      <div className="flex items-center justify-center">
                        <span className="text-sm text-gray-600">
                          This post has been approved
                          <span className="ml-2 text-green-600">✓</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {filteredPosts.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </div>
          {/* Main Content - Post Details */}
          <div className="lg:w-1/2">
            {selectedPost ? (
              <div className="bg-white rounded-lg shadow-sm border">
                {/* Post Header */}
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">{selectedPost.title}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPost.approved)}`}>
                      {selectedPost.approved}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">By {selectedPost.author?.username || "Unknown"}</span>
                      <span>{selectedPost.category?.name || ""}</span>
                    </div>
                    <span>{formatDate(selectedPost.createdAt)}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(selectedPost.tags || []).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Post Content</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selectedPost.content}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedPost.approved === 'pending' && (
                  <div className="p-6 border-t bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Post</h3>
                      <p className="text-sm text-gray-600">Choose an action for this post</p>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleApprove(selectedPost._id)}
                        className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2 shadow-md"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Approve Post</span>
                      </button>
                      <button
                        onClick={() => handleReject(selectedPost._id)}
                        className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center space-x-2 shadow-md"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Reject Post</span>
                      </button>
                    </div>
                  </div>
                )}
                {selectedPost.approved && (
                  <div className="p-6 border-t bg-gray-50">
                    <div className="text-center">
                      <div className="inline-flex items-center space-x-2 text-gray-600">
                        <span>This post has been approved</span>
                        <span className="text-green-600 text-xl">✓</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Select a Post</h3>
                <p className="text-gray-500">Choose a post from the list to review its content and take action.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPostsApproval
