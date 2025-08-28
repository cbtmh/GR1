import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Categories from '../pages/Categories';
import CreatePost from '../pages/CreatePost';
import RegisterForm from '../pages/Register';
import LoginForm from '../pages/Login';
import AuthLayout from '../components/layout/authLayout';
import DefaultLayout from '../components/layout/defaultLayout';
import Articles from '../pages/Articles';
import Profile from '../pages/Profile';
import PrivateRoute from './PrivateRoute';
import AdminPostsApproval from '../pages/AdminPostsApproval';
import AdminLogin from '../pages/AdminLogin';
import PostDetail from '../pages/PostDetail';
import EditPost from '../pages/EditPost';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DefaultLayout><Home /></DefaultLayout>} />
            <Route path="/about" element={<DefaultLayout><About /></DefaultLayout>} />
            <Route path="/categories" element={<DefaultLayout><Categories /></DefaultLayout>} />
            <Route path="/create-post" element={<PrivateRoute />}>
                <Route index element={<DefaultLayout><CreatePost /></DefaultLayout>} />
            </Route>
            <Route path="/register" element={<AuthLayout><RegisterForm /></AuthLayout>} />
            <Route path="/login" element={<AuthLayout><LoginForm /></AuthLayout>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/articles" element={<DefaultLayout><Articles /></DefaultLayout>} />
            <Route path="/profile" element={<PrivateRoute />}>
                <Route path=":id" element={<DefaultLayout><Profile /></DefaultLayout>} />
            </Route>
            <Route path="/posts/:id" element={<DefaultLayout><PostDetail /></DefaultLayout>} />
            <Route path="/admin/posts-approval" element={<AdminPostsApproval />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/posts/:id/edit" element={<DefaultLayout><EditPost /></DefaultLayout>} />
        </Routes>
    );
};

export default AppRoutes;