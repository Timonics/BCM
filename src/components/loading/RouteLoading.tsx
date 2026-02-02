import React from "react";

const RouteLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-500">Loading content...</p>
      </div>
    </div>
  );
};

export default RouteLoading;