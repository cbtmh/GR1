// components/ResetPassword.jsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { useAuth } from '../services/authContext';


export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { token } = useParams(); // Lấy token từ URL
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { setCurrentUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await apiClient.patch(`/users/reset-password/${token}`, { password });
            
            // Xử lý đăng nhập sau khi reset thành công
            const apiUser = response.data;
            const userPayload = {
                id: apiUser._id,
                username: apiUser.username,
                email: apiUser.email,
                avatar: apiUser.avatar && apiUser.avatar.startsWith('/') ? `http://localhost:5000${apiUser.avatar}` : apiUser.avatar,
                token: apiUser.token
            };

            dispatch(login(userPayload));
            setCurrentUser(userPayload);

            setSuccess('Password has been reset successfully! Redirecting...');
            setTimeout(() => navigate('/'), 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired token. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset Your Password</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="password" className="sr-only">New Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="sr-only">Confirm New Password</label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {success && <p className="text-sm text-green-600">{success}</p>}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                            Reset Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}