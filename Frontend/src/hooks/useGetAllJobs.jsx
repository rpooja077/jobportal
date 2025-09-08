/**
 * useGetAllJobs Custom Hook
 * 
 * A custom React hook for fetching all job listings with search functionality.
 * Handles loading states, errors, and updates the Redux store with the fetched jobs.
 * 
 * Features:
 * - Fetches jobs from the API with optional search query
 * - Handles authentication states gracefully
 * - Updates Redux store with fetched jobs
 * - Manages loading and error states
 * - Silently handles 401 Unauthorized errors (treats as empty list)
 * 
 * @returns {Object} An object containing:
 *   - loading: Boolean indicating if data is being fetched
 *   - error: Error message if request fails, null otherwise
 *   
 * @example
 * const { loading, error } = useGetAllJobs();
 * 
 * @dependencies react, react-redux, axios
 */
import { setAllJobs } from "@/redux/jobSlice";
import { JOB_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllJobs = () => {
  // Initialize Redux dispatch and local state
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get search query from Redux store
  const { searchedQuery } = useSelector((store) => store.jobs);

  useEffect(() => {
    /**
     * Fetches all jobs from the API with optional search filtering
     * Handles response and updates Redux store accordingly
     */
    const fetchAllJobs = async () => {
      // Set loading state and clear any previous errors
      setLoading(true);
      setError(null);
      
      try {
        // Make API request to fetch jobs with search query
        const res = await axios.get(
          `${JOB_API_ENDPOINT}/get?keyword=${encodeURIComponent(searchedQuery || '')}`,
          { withCredentials: true }
        );
        
        // Debug logging (commented out in production)
        if (process.env.NODE_ENV === 'development') {
          console.log("Jobs API Response:", res.data);
        }
        
        // Check if response is valid (supports both {success, jobs} and direct array responses)
        const isValidResponse = res?.data?.success === true || Array.isArray(res?.data?.jobs);
        
        if (isValidResponse) {
          // Update Redux store with fetched jobs, defaulting to empty array if undefined
          dispatch(setAllJobs(Array.isArray(res.data.jobs) ? res.data.jobs : []));
          setError(null);
        } else {
          // Handle invalid response format by treating as empty list
          dispatch(setAllJobs([]));
          setError(null);
        }
      } catch (error) {
        // Log error in development
        if (process.env.NODE_ENV === 'development') {
          console.error("Error fetching jobs:", error);
        }
        
        // Handle specific error cases
        if (error?.response?.status === 401) {
          // For unauthorized access, treat as empty list (public view)
          dispatch(setAllJobs([]));
          setError(null);
        } else {
          // For other errors, set appropriate error message
          const errorMessage = error.response?.data?.message || 
                             error.message || 
                             "Failed to load jobs. Please try again later.";
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    // Execute the fetch operation
    fetchAllJobs();
    
    // Cleanup function to cancel any pending requests if component unmounts
    return () => {
      // Add cleanup logic here if needed (e.g., cancel axios request)
    };
  }, [dispatch, searchedQuery]); // Re-run when search query changes

  // Return the current state
  return { loading, error };
};

export default useGetAllJobs;
