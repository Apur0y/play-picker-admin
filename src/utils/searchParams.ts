import { useLocation } from "react-router-dom";

// Function to parse query parameters
export function useQuery() {
  return new URLSearchParams(useLocation().search);
}
