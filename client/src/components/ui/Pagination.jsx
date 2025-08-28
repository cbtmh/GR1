const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // Generate page numbers array
    const pageNumbers = []
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }
  
    // Don't render if there's only one page
    if (totalPages <= 1) return null
  
    return (
      <nav className="flex justify-center mt-8">
        <ul className="flex items-center gap-1">
          {/* Previous button */}
          <li>
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-md ${
                currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-label="Previous page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
  
          {/* Page numbers */}
          {pageNumbers.map((number) => {
            // Show limited page numbers with ellipsis for better UX
            if (number === 1 || number === totalPages || (number >= currentPage - 1 && number <= currentPage + 1)) {
              return (
                <li key={number}>
                  <button
                    onClick={() => onPageChange(number)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === number ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                    aria-label={`Page ${number}`}
                    aria-current={currentPage === number ? "page" : undefined}
                  >
                    {number}
                  </button>
                </li>
              )
            } else if (
              (number === currentPage - 2 && currentPage > 3) ||
              (number === currentPage + 2 && currentPage < totalPages - 2)
            ) {
              return (
                <li key={number} className="px-2">
                  <span className="text-gray-500">...</span>
                </li>
              )
            }
            return null
          })}
  
          {/* Next button */}
          <li>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-md ${
                currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-label="Next page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    )
  }
  
  export default Pagination
  