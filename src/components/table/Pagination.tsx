// components/Pagination.tsx

import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pageNumbers = [];
  const maxVisible = 2;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - maxVisible && i <= currentPage + maxVisible)
    ) {
      pageNumbers.push(i);
    } else if (
      i === currentPage - maxVisible - 1 ||
      i === currentPage + maxVisible + 1
    ) {
      pageNumbers.push("...");
    }
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-6 flex-wrap text-sm">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-2 py-1 rounded border hover:bg-gray-100 disabled:text-gray-400"
      >
        ⏮
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 rounded border hover:bg-gray-100 disabled:text-gray-400"
      >
        ◀
      </button>

      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-2 py-1 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(Number(page))}
            className={`px-3 py-1 rounded border ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 rounded border hover:bg-gray-100 disabled:text-gray-400"
      >
        ▶
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 rounded border hover:bg-gray-100 disabled:text-gray-400"
      >
        ⏭
      </button>
    </div>
  );
};

export default Pagination;
