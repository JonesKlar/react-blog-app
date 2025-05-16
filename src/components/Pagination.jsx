// Pagination component to handle navigation between pages
function Pagination({ totalPages, currentPage, onPageChange }) {
    return (
      <div className="join justify-center mt-6">
        {/* Generate an array of buttons for each page */}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i} // Unique key for each button
            onClick={() => onPageChange(i + 1)} // Call onPageChange with the selected page number
            className={`join-item btn ${currentPage === i + 1 ? 'btn-active' : ''}`} // Highlight the active page
          >
            {i + 1} {/* Display the page number */}
          </button>
        ))}
      </div>
    );
  }
  
  export default Pagination;
