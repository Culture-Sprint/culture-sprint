
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface StoriesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const StoriesPagination = ({ currentPage, totalPages, onPageChange }: StoriesPaginationProps) => {
  // Create array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // If we have 5 or fewer pages, show all page numbers
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);
      
      // Calculate start and end of the displayed range
      let rangeStart = Math.max(2, currentPage - 1);
      let rangeEnd = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust the range to always show 3 page numbers in the middle when possible
      if (rangeEnd - rangeStart + 1 < 3) {
        if (currentPage < totalPages / 2) {
          rangeEnd = Math.min(totalPages - 1, rangeStart + 2);
        } else {
          rangeStart = Math.max(2, rangeEnd - 2);
        }
      }
      
      // Add ellipsis before middle pages if needed
      if (rangeStart > 2) {
        pages.push(-1); // Use -1 to represent ellipsis
      }
      
      // Add the middle page numbers
      for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
      }
      
      // Add ellipsis after middle pages if needed
      if (rangeEnd < totalPages - 1) {
        pages.push(-2); // Use -2 to represent ellipsis (different key from the first ellipsis)
      }
      
      // Always include last page
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  return (
    <Pagination>
      <PaginationContent>
        {/* Previous button */}
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            tabIndex={currentPage === 1 ? -1 : 0}
          />
        </PaginationItem>
        
        {/* Page numbers */}
        {getPageNumbers().map((pageNum, index) => (
          <PaginationItem key={index}>
            {pageNum < 0 ? (
              <span className="flex h-9 w-9 items-center justify-center">...</span>
            ) : (
              <PaginationLink
                isActive={pageNum === currentPage}
                onClick={() => onPageChange(pageNum)}
                className={`
                  ${pageNum === currentPage ? "bg-brand-primary hover:bg-brand-primary text-white border-brand-primary" : ""} 
                  cursor-pointer
                `}
              >
                {pageNum}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        
        {/* Next button */}
        <PaginationItem>
          <PaginationNext 
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            tabIndex={currentPage === totalPages ? -1 : 0}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default StoriesPagination;
