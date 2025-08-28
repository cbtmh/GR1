const CategoryCard = ({ category, featured, onSelect }) => {
  const { name, description, articleCount, image, color } = category

  return featured ? (
    // Featured category card (larger)
    <div
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => {
        onSelect && onSelect();
      }}
    >
      <div className="relative h-48">
        <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
        <div className={`absolute inset-0 opacity-60 ${color}`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-white text-3xl font-bold drop-shadow-lg">{name}</h3>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{articleCount} articles</span>
          <button
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors duration-200"
            onClick={e => {
              e.stopPropagation();
              onSelect && onSelect();
            }}
          >
            Explore
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  ) : (
    // Regular category card (smaller)
    <div
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer flex flex-col"
      onClick={() => {
        onSelect && onSelect();
      }}
    >
      <div className="relative h-32">
        <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
        <div className={`absolute inset-0 opacity-70 ${color}`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-white text-xl font-bold drop-shadow-md">{name}</h3>
        </div>
      </div>
      <div className="p-4 flex-grow">
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xs text-gray-500">{articleCount} articles</span>
          <button
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors duration-200"
            onClick={e => {
              e.stopPropagation();
              onSelect && onSelect();
            }}
          >
            View
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CategoryCard
