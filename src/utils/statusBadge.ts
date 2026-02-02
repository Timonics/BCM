export const getStatusBadgeColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pre youth":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "baptism":
      return "bg-cyan-100 text-cyan-700 border-cyan-200";
    case "ets":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "active":
      return "bg-green-100 text-green-700 border-green-200";
    case "suspended":
      return "bg-red-100 text-red-700 border-red-200";
    case "overgrown band":
      return "bg-orange-100 text-orange-700 border-orange-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};
