import React from 'react';

const TableSkeleton = ({ rows = 5, columns = 5 }) => {
  return (
    <div className="animate-pulse">
      {/* Table Header Skeleton */}
      <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-300 rounded w-3/4"></div>
        ))}
      </div>

      {/* Table Rows Skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-gray-100"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={`h-4 bg-gray-200 rounded ${
                colIndex === columns - 1 ? 'w-24' : 'w-full'
              }`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
