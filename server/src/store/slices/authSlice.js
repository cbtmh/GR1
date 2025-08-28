import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: localStorage.getItem('user') !== null,
    user: (() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
                return null;
            }
        }
        return null;
    })(),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('user');
        },
        // --- REDUCER MỚI ĐƯỢC THÊM VÀO ---
        updateUserAvatar: (state, action) => {
            // Kiểm tra xem user có đang đăng nhập không
            if (state.user) {
                // Cập nhật đường dẫn avatar trong state
                state.user.avatar = action.payload; // action.payload là đường dẫn avatar mới
                
                // Cập nhật lại localStorage để dữ liệu được lưu sau khi tải lại trang
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        },
    },
});

// Thêm action mới vào danh sách export
export const { login, logout, updateUserAvatar } = authSlice.actions;
export default authSlice.reducer;