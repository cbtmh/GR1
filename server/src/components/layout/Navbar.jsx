import { useState, useEffect, useRef } from "react"; // Thêm useRef
import { Menu, X } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useAuth } from "../../services/authContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { setCurrentUser } = useAuth(); 
  // Tạo ref cho nút mở dropdown và menu dropdown
  const dropdownButtonRef = useRef(null);
  const dropdownMenuRef = useRef(null);


  const handleLogout = () => {
    dispatch(logout()); // Xóa trạng thái trong Redux
    setCurrentUser(null); // Xóa trạng thái trong AuthContext và localStorage
    navigate("/"); // Điều hướng về trang chủ sau khi logout
};

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  }, [location]);

  // Effect để xử lý việc click ra ngoài dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen &&
        dropdownButtonRef.current && !dropdownButtonRef.current.contains(event.target) &&
        dropdownMenuRef.current && !dropdownMenuRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    // Thêm event listener khi dropdown mở
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]); // Chỉ chạy lại effect này khi isDropdownOpen thay đổi


  const handleNavigateToProfile = () => {
    if (user && (user.id || user._id)) {
      // Ưu tiên user.id nếu có, nếu không thì dùng user._id
      const profileId = user.id || user._id;
      navigate(`/profile/${profileId}`);
    } else {
      console.error("User ID is undefined, cannot navigate to profile.");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl font-bold text-gray-800">BlogApp</Link> {/* Thêm Link cho logo */}
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className={`${location.pathname === '/' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>Home</Link>
              <Link to="/articles" className={`${location.pathname.startsWith('/articles') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>Articles</Link>
              <Link to="/categories" className={`${location.pathname.startsWith('/categories') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>Categories</Link>
              <Link to="/about" className={`${location.pathname === '/about' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>About</Link>
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated && user ? (
              <div className="relative">
                {/* Gán ref cho nút mở dropdown */}
                <button ref={dropdownButtonRef} onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center focus:outline-none p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <img className="h-10 w-10 rounded-full object-cover" src={user?.avatar || '/placeholder.svg?height=40&width=40'} alt="User avatar" />
                </button>
                {isDropdownOpen && (
                  // Gán ref cho menu dropdown
                  <div ref={dropdownMenuRef} className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                    <button onClick={handleNavigateToProfile} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                      User Profile
                    </button>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => navigate('/login')}>
                  Log in
                </button>
                <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => navigate('/register')}>
                  Register
                </button>
              </div>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className={`${location.pathname === '/' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>Home</Link>
            <Link to="/articles" className={`${location.pathname.startsWith('/articles') ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>Articles</Link>
            <Link to="/categories" className={`${location.pathname.startsWith('/categories') ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>Categories</Link>
            <Link to="/about" className={`${location.pathname === '/about' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>About</Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated && user ? (
              <div>
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img className="h-10 w-10 rounded-full object-cover" src={user?.avatar || '/placeholder.svg?height=40&width=40'} alt="User avatar" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user?.username || user?.name || 'User'}</div>
                    <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <button onClick={handleNavigateToProfile} className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                    User Profile
                  </button>
                  <button onClick={handleLogout} className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 px-4 pt-2"> {/* Thêm pt-2 để có khoảng cách */}
                <button type="button" className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => navigate('/login')}>
                  Log in
                </button>
                <button type="button" className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => navigate('/register')}>
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;