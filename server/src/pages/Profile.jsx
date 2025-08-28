import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../services/apiClient";
import { useDispatch, useSelector } from "react-redux";
import { updateUserAvatar } from '../store/slices/authSlice'; // Action mới sẽ tạo ở Bước 3
import { Edit } from "lucide-react"; // Icon cho nút edit
import { useNavigate } from "react-router-dom"; // Để điều hướng đến trang tạo bài viết
import PostCard from "../components/ui/PostCard";

const Profile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [showAllPosts, setShowAllPosts] = useState(false); // State to toggle showing all posts
  const fileInputRef = useRef(null); // Ref để trigger input file
  const coverInputRef = useRef(null); // Ref cho input cover image
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Để điều hướng đến trang tạo bài viết
  const { user } = useSelector((state) => state.auth); // Lấy user từ Redux

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await apiClient.get(`/users/profile/${id}`);
        setUserData(userResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const postsResponse = await apiClient.get(`/posts/user/${id}`);
        const postsWithId = postsResponse.data.map(post => ({
          ...post,
          id: post._id || post.id
        }));
        setUserPosts(postsWithId);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    fetchUserData();
    fetchUserPosts();
  }, [id]);
  const handlePostDeleted = (deletedPostId) => {
    setUserPosts(prevPosts => prevPosts.filter(post => post._id !== deletedPostId));
  };
  if (!id) {
    console.error("Profile ID is undefined");
    return <div>Error: Profile ID is missing.</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  const isOwnProfile = user && (user.id === id || user._id === id);
  const avatarUrl = isOwnProfile ? user?.avatar : userData.avatar;

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;


    const formData = new FormData();
    formData.append('avatar', file);

    try {

      const response = await apiClient.put(`/users/profile/avatar`, formData);

      const newAvatarUrl = response.data.avatarUrl;
 
      setUserData(prevData => ({ ...prevData, avatar: newAvatarUrl }));
      dispatch(updateUserAvatar(newAvatarUrl)); // Cập nhật Redux (Bước 3)

    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };


  const handleCoverChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('coverImage', file);
    try {
      const response = await apiClient.put(`/users/profile/cover`, formData);
      const newCoverUrl = response.data.coverImageUrl;
      setUserData(prevData => ({ ...prevData, coverImage: newCoverUrl }));
    } catch (error) {
      console.error("Error uploading cover image:", error);
    }
  };


  const coverUrl = userData.coverImage
    ? userData.coverImage.startsWith('http')
      ? userData.coverImage
      : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${userData.coverImage}`
    : "/placeholder.svg";

  const displayedPosts = showAllPosts ? userPosts : userPosts.slice(0, 4); // Limit posts to 4 unless showAllPosts is true

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-500 to-purple-600">
        <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
        <input
          type="file"
          ref={coverInputRef}
          onChange={handleCoverChange}
          accept="image/png, image/jpeg, image/gif, image/jpg"
          className="hidden"
        />
        {/* Nút đổi cover, chỉ hiện nếu là profile của chính mình */}
        {isOwnProfile && (
          <button
            className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-opacity-100 transition"
            onClick={() => coverInputRef.current.click()}
            title="Change cover image"
          >
            <Edit className="w-6 h-6 text-gray-700" />
          </button>
        )}

      </div>

      {/* Profile Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={avatarUrl || "/placeholder.svg"}
                alt={userData.username}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/gif, image/jpg"
                className="hidden"
              />
              {/* Lớp phủ và icon edit, chỉ hiện khi hover */}
              <div
                className="absolute inset-0 rounded-full bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center cursor-pointer transition-opacity"
                onClick={() => fileInputRef.current.click()}
              >
                <Edit className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{userData.username}</h1>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-4 sm:mt-0">
                  <button
                    onClick={() => navigate("/create-post")}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Create New Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6">
            <p className="text-gray-700 max-w-2xl">{userData.bio}</p>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-8 pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Posts</h2>
            <button onClick={() => setShowAllPosts(!showAllPosts)} className="text-blue-600 hover:text-blue-700 font-medium">
              {showAllPosts ? "Hide Posts" : "View All Posts"}
            </button>
          </div>

          {/* Posts Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPostDelete={handlePostDeleted}
              />
            ))}
          </div>

          {/* Create Post CTA */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to share your thoughts?</h3>
              <p className="text-gray-600 mb-4">Create a new post and share your knowledge with the community.</p>
              <button
                onClick={() => navigate("/create-post")}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create New Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
