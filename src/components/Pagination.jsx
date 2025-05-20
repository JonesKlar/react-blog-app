import React, { useState, useEffect } from 'react'

/**
 * Responsive Pagination Component
 * - On screens narrower than 440px: renders Prev / Next buttons
 * - On wider screens: renders full numeric pagination with horizontal scroll if needed
 *
 * @param {number} currentPage    current active page
 * @param {number} totalPages     total number of pages
 * @param {(page: number) => void} onPageChange callback when page clicked
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Hook to detect narrow screens (<440px)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 440 : false
  )

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 440)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Mobile view: Prev / Next
  if (isMobile) {
    return (
      <div className="flex justify-end mt-6 space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="btn btn-sm"
        >
          Prev
        </button>
        <span className="btn btn-sm btn-disabled">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="btn btn-sm"
        >
          Next
        </button>
      </div>
    )
  }

  // Desktop / tablet view: numeric pagination
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <div className="mt-6">
      <div className="overflow-x-auto scrollbar-none">
        <div className="join justify-center whitespace-nowrap">
          {pages.map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`join-item btn px-3 ${page === currentPage ? 'btn-active' : ''}`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
