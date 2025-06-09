# web-blog application

Đây là một ứng dụng blog được xây dựng với React và Express.js, cho phép người dùng tạo và quản lý bài viết.

## ✨ Tính năng

* Tính năng 1: Đăng ký, đăng nhập người dùng.
* Tính năng 2: Tạo, xem, sửa bài viết.
* Tính năng 3: User có thể comment vào bài viết

## 🛠️ Công nghệ sử dụng

**Frontend:**
* Vite
* React 
* Tailwind CSS

**Backend:**
* Node.js
* Express.js 
* MongoDB 

## 📂 Cấu trúc Project
Project được chia thành hai phần chính:
* `/`: Chứa code cho phần frontend (client-side).
* `/api`: Chứa code cho phần backend (server-side).

## 🚀 Hướng dẫn cài đặt và chạy Project
1.  **Clone repository về máy:**
    ```bash
    git clone [https://github.com/cbtmh/GR1.git]
    cd GR1
    ```
2.  **Cài đặt cho Backend:**
    ```bash
    # Di chuyển vào thư mục api
    cd api

    # Cài đặt các package cần thiết
    npm install

    # Tạo file .env và cấu hình các biến môi trường
    ```
3.  **Cài đặt cho Frontend:**
    ```bash
    # Quay lại thư mục gốc
    cd ..

    # Cài đặt các package cần thiết
    npm install
    ```
4.  **Khởi chạy Project:**
    * **Chạy Backend:** Mở một terminal, di chuyển vào thư mục `/api` và chạy:
        ```bash
        npm start  # Hoặc npm run dev
        ```
    * **Chạy Frontend:** Mở một terminal khác, ở thư mục gốc và chạy:
        ```bash
        npm run dev
        ```
    Frontend sẽ chạy ở `http://localhost:5173` và backend sẽ chạy ở `http://localhost:5000`
