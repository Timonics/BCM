import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router";

const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800">{error.status}</h1>
        <p className="text-xl text-gray-600 mt-2">{error.statusText}</p>
        {error.data?.message && (
          <p className="text-gray-500 mt-4">{error.data.message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-red-600">Oops!</h2>
      <p className="text-gray-600 mt-2">Something went wrong loading this page.</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
};

export default RouteErrorBoundary;