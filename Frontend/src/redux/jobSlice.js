/**
 * jobSlice.js
 * 
 * Redux slice for managing job-related state in the application.
 * This slice handles state for job listings, search functionality, and job applications.
 * 
 * State Structure:
 * - allJobs: Array of all jobs visible to regular users
 * - allAdminJobs: Array of all jobs visible to admin users (includes all jobs regardless of status)
 * - singleJob: Currently selected job details
 * - searchJobByText: Text used for filtering jobs by title/description
 * - allAppliedJobs: Array of jobs the current user has applied to
 * - searchedQuery: Current search query for job listings
 */

import { createSlice } from "@reduxjs/toolkit";

/**
 * Initial state for the jobs slice
 * @type {Object}
 */
const initialState = {
  allJobs: [],          // All jobs visible to regular users
  allAdminJobs: [],     // All jobs visible to admin users
  singleJob: null,      // Currently selected job details
  searchJobByText: "",  // Text filter for job search
  allAppliedJobs: [],   // Jobs the current user has applied to
  searchedQuery: "",    // Current search query
};

/**
 * Redux slice for job-related state management
 */
const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    /**
     * Updates the list of all jobs
     * @param {Object} state - Current Redux state
     * @param {Object} action - Redux action containing the payload with jobs array
     */
    setAllJobs(state, action) {
      state.allJobs = action.payload;
    },
    
    /**
     * Sets the currently selected job details
     * @param {Object} state - Current Redux state
     * @param {Object} action - Redux action containing the payload with job details
     */
    setSingleJob(state, action) {
      state.singleJob = action.payload;
    },
    
    /**
     * Updates the list of all jobs for admin view
     * @param {Object} state - Current Redux state
     * @param {Object} action - Redux action containing the payload with admin jobs array
     */
    setAllAdminJobs(state, action) {
      state.allAdminJobs = action.payload;
    },
    
    /**
     * Updates the job search filter text
     * @param {Object} state - Current Redux state
     * @param {Object} action - Redux action containing the payload with search text
     */
    setSearchJobByText(state, action) {
      state.searchJobByText = action.payload;
    },
    
    /**
     * Updates the list of jobs the current user has applied to
     * @param {Object} state - Current Redux state
     * @param {Object} action - Redux action containing the payload with applied jobs array
     */
    setAllAppliedJobs(state, action) {
      state.allAppliedJobs = action.payload;
    },
    
    /**
     * Updates the current search query
     * @param {Object} state - Current Redux state
     * @param {Object} action - Redux action containing the payload with search query
     */
    setSearchedQuery(state, action) {
      state.searchedQuery = action.payload;
    },
  },
});

// Export action creators
export const {
  setAllJobs,
  setSingleJob,
  setAllAdminJobs,
  setSearchJobByText,
  setAllAppliedJobs,
  setSearchedQuery,
} = jobSlice.actions;

// Export the reducer
export default jobSlice.reducer;
