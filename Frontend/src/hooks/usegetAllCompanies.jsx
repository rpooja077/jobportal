/**
 * useGetAllCompanies Custom Hook
 * 
 * A custom React hook for fetching all companies from the API.
 * Updates the Redux store with the fetched companies and manages loading states.
 * 
 * Features:
 * - Fetches all companies from the API on component mount
 * - Updates Redux store with the fetched companies
 * - Handles loading and error states
 * - Includes caching headers to prevent stale data
 * 
 * @returns {Object} An object containing:
 *   - loading: Boolean indicating if data is being fetched
 *   - error: Error message if request fails, null otherwise
 * 
 * @example
 * const { loading, error } = useGetAllCompanies();
 * 
 * @dependencies react, react-redux, axios
 */
import { setCompanies } from "@/redux/companyslice";
import { COMPANY_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetAllCompanies = () => {
  // Initialize Redux dispatch and local state
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * Fetches all companies from the API
     * Updates Redux store with the fetched data
     */
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Make API request to fetch all companies
        const res = await axios.get(`${COMPANY_API_ENDPOINT}/get`, {
          withCredentials: true,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        // Debug logging in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Companies API Response:', res.data);
        }
        
        // Update Redux store if request was successful
        if (res.data?.success && Array.isArray(res.data.companies)) {
          dispatch(setCompanies(res.data.companies));
        } else {
          throw new Error('Invalid companies data received');
        }
      } catch (error) {
        // Log error in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching companies:', error);
        }
        
        // Set error state with user-friendly message
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Failed to load companies. Please try again later.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch companies when component mounts
    fetchCompanies();
    
    // Cleanup function to cancel any pending requests if component unmounts
    return () => {
      // Add cleanup logic here if needed (e.g., cancel axios request)
    };
  }, [dispatch]); // Only run on mount
  
  // Return the current state
  return { loading, error };
};

export default useGetAllCompanies;
