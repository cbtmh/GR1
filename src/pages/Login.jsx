import React, { useEffect } from "react"
import { useState } from "react"
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from "../services/authContext";

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({ email: "", password: "" })
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setCurrentUser, currentUser } = useAuth(); // Lấy currentUser từ AuthContext
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    // Nếu đã đăng nhập và đang ở đúng /login thì redirect về home
    if ((currentUser || isAuthenticated) && window.location.pathname === "/login") {
      // Chỉ redirect nếu không phải do submit form (tức là không phải vừa login thành công)
      if (!window.__justLoggedIn) {
        navigate("/", { replace: true });
      }
      window.__justLoggedIn = false;
    }
    // Nếu chưa đăng nhập và đang ở / thì cho phép vào login (không redirect)
  }, [currentUser, isAuthenticated, navigate]);

  const validateForm = () => {
    let valid = true
    const newErrors = { email: "", password: "" }

    if (!email) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
      valid = false
    }

    if (!password) {
      newErrors.password = "Password is required"
      valid = false
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // 1. Gọi API và lấy dữ liệu người dùng từ backend
        const response = await apiClient.post('/users/login', { email, password });
        const apiUser = response.data; // Dữ liệu này có dạng { _id: "...", ... }

        // 2. --- CHUẨN HÓA DỮ LIỆU (QUAN TRỌNG) ---
        // Xử lý avatar absolute URL
        let avatar = apiUser.avatar;
        if (avatar && avatar.startsWith('/')) {
          avatar = `http://localhost:5000${avatar}`;
        }
        // Tạo một payload mới cho Redux, ánh xạ `_id` từ API sang `id`
        const userPayload = {
          id: apiUser._id, // Ánh xạ _id thành id
          username: apiUser.username,
          email: apiUser.email,
          avatar: avatar, // Đảm bảo avatar là absolute URL
          token: apiUser.token
        };

        // 3. Dispatch action `login` với đối tượng đã được chuẩn hóa
        dispatch(login(userPayload));

        // Add detailed logs to debug the data passed to setCurrentUser
        console.log("Login response data:", apiUser);
        console.log("Calling setCurrentUser with:", userPayload);
        setCurrentUser(userPayload);
        // Đánh dấu vừa login thành công để tránh redirect ngay lập tức khi vừa login xong
        window.__justLoggedIn = true;
        navigate('/');
      } catch (error) {
        console.error('Login failed:', error);
        setErrors((prevErrors) => ({ ...prevErrors, email: 'Invalid credentials' }));
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.email ? "border-red-300" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.password ? "border-red-300" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Sign in
            </button>
          </div>
          <div className="text-sm text-center">
            <p>
              Don't have an account?{' '}
              <a href="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
                Register
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}