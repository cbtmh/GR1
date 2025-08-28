import React from 'react';

const ArticlesCard = ({ article, onClick }) => {
  const { title, excerpt, category, author, date, readTime, image, tags, avatar } = article;

  // Định dạng ngày tháng năm (không hiện giờ)
  const formattedDate = date ? new Date(date).toLocaleDateString('vi-VN') : '';

  return (
    <article
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col justify-between h-full"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors duration-200">
          {title}
        </h2>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        {/* Thông tin ngày tháng, category, v.v. nếu cần */}
        <div className="flex-1"></div>
        {/* Avatar và tên tác giả ở cuối card */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4 text-sm text-gray-500">
          <div className="flex items-center">
            <img
              src={avatar || "/placeholder.svg"}
              alt={author}
              className="h-8 w-8 rounded-full bg-gray-200 mr-2 object-cover"
            />
            <span>{author}</span>
          </div>
          <span>{formattedDate}</span>
        </div>
      </div>
    </article>
  );
};

export default ArticlesCard;