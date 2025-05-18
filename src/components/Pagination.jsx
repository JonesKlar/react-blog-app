// Pagination component to handle navigation between pages
function Pagination({ totalPages, currentPage, onPageChange }) {
    return (
      <div className="join justify-center mt-6">
        {/* Generate an array of buttons for each page */}
        {Array.from({ length: totalPages }, (_, page) => (
          <button
            key={page} // Unique key for each button
            onClick={() => onPageChange(page + 1)} // Call onPageChange with the selected page number
            className={`join-item btn ${currentPage === page + 1 ? 'btn-active' : ''}`} // Highlight the active page
          >
            {page + 1} {/* Display the page number */}
          </button>
        ))}
      </div>
    );
  }
  
  export default Pagination;
