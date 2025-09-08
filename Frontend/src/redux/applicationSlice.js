/**
 * applicationSlice.js
 * 
 * Redux slice for managing job application state in the application.
 * This slice handles state for job applicants and their application statuses.
 * 
 * State Structure:
 * - applicants: Array of applicants with their application details or null if not loaded
 */

import { createSlice } from "@reduxjs/toolkit";

/**
 * Initial state for the application slice
 * @type {Object}
 */
const initialState = {
  applicants: null,  // Array of applicant objects or null if not loaded
};

/**
 * Redux slice for application-related state management
 */
const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    /**
     * Updates the list of all applicants
     * @param {Object} state - Current Redux state
     * @param {Object} action - Redux action containing the payload with applicants data
     * @param {Array|null} action.payload - Array of applicant objects or null to clear
     */
    setAllApplicants: (state, action) => {
      state.applicants = action.payload;
    },
    
    /**
     * Updates the status of a specific applicant
     * @param {Object} state - Current Redux state
     * @param {Object} action - Redux action containing the payload with update info
     * @param {string} action.payload.applicantId - ID of the applicant to update
     * @param {string} action.payload.status - New status to set for the applicant
     */
    updateApplicantStatus: (state, action) => {
      const { applicantId, status } = action.payload;
      if (state.applicants) {
        const index = state.applicants.findIndex(app => app._id === applicantId);
        if (index !== -1) {
          state.applicants[index].status = status;
        }
      }
    },
    
    /**
     * Clears all application data
     * @param {Object} state - Current Redux state
     */
    clearApplications: (state) => {
      state.applicants = null;
    }
  }
});

// Export action creators
export const { 
  setAllApplicants, 
  updateApplicantStatus,
  clearApplications 
} = applicationSlice.actions;

// Selectors
export const selectAllApplicants = (state) => state.application.applicants;
export const selectApplicantById = (state, applicantId) => 
  state.application.applicants?.find(app => app._id === applicantId) || null;

// Export the reducer as default
export default applicationSlice.reducer;

// Export the reducer with a named export as well
export const applicationReducer = applicationSlice.reducer;
