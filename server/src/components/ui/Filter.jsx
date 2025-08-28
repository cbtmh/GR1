const Filter = ({ categories, selectedCategory, onCategoryChange }) => {
    return (
      <div className="w-full">
        <label htmlFor="category-filter" className="sr-only">
          Filter by category
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          aria-label="Filter articles by category"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "All" ? "All Categories" : category}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    )
  }
  
  export default Filter
  