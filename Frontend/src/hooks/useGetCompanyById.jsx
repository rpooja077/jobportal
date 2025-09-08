/**
 * useGetCompanyById Custom Hook
 * 
 * A custom React hook for fetching a single company's details by its ID.
 * Updates the Redux store with the fetched company data and manages loading states.
 * 
 * Features:
 * - Fetches company data from the API using company ID
 * - Updates Redux store with the fetched company
 * - Handles loading and error states internally
 * - Only makes API call when companyId is provided
 * 
 * @param {string} companyId - The ID of the company to fetch
 * 
 * @example
 * // In a React component:
 * useGetCompanyById("123abc");
 * 
 * @dependencies react, react-redux, axios
 */
import { setSingleCompany } from "@/redux/companyslice";
import { COMPANY_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetCompanyById = (companyId) => {
  // Initialize Redux dispatch and local state
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * Fetches a single company's details by ID
     * Updates Redux store with the fetched data
     */
    const fetchSingleCompany = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Make API request to fetch company details
        const res = await axios.get(
          `${COMPANY_API_ENDPOINT}/get/${companyId}`,
          { 
            withCredentials: true,
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          }
        );
        
        // Debug logging in development
        if (process.env.NODE_ENV === 'development') {
          console.log("Company API Response:", res.data);
        }
        
        // Update Redux store with the fetched company data
        if (res.data?.company) {
          dispatch(setSingleCompany(res.data.company));
        } else {
          throw new Error("Invalid company data received");
        }
      } catch (error) {
        // Log error in development
        if (process.env.NODE_ENV === 'development') {
          console.error("Error fetching company:", error);
        }
        
        // Set error state with user-friendly message
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           "Failed to load company details. Please try again later.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if companyId is provided
    if (companyId) {
      fetchSingleCompany();
    } else {
      // Reset state if no companyId is provided
      setLoading(false);
      setError(null);
    }
    
    // Cleanup function to cancel any pending requests if component unmounts
    return () => {
      // Add cleanup logic here if needed (e.g., cancel axios request)
    };
  }, [companyId, dispatch]);
  
  // Return the current state
  return { loading, error };
};

export default useGetCompanyById;
