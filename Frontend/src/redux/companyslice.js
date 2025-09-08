/**
 * companySlice.js
 * 
 * Redux slice for managing company-related state in the application.
 * This slice handles state for company listings, search functionality, and individual company details.
 * 
 * State Structure:
 * - singleCompany: Object containing details of a single company
 * - companies: Array of all companies
 * - searchCompanyByText: Text used for filtering companies by name or other attributes
 */

import { createSlice } from "@reduxjs/toolkit";

/**
 * Initial state for the company slice
 * @type {Object}
 */
const initialState = {
  singleCompany: {},         // Currently selected company details
  companies: [],             // List of all companies
  searchCompanyByText: "",   // Text filter for company search
};

/**
 * Redux slice for company-related state management
 */
const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    /**
     * Updates the currently selected company details
     * @param {Object} state - Current Redux state
     * @param {Object} action - Redux action containing the payload with company data
     * @param {Object} action.payload - The company data object
     */
    setSingleCompany: (state, action) => {
      state.singleCompany = action.payload || {};
    },

    /**
     * Updates the list of all companies
     * @param {Object} state - Current Redux state
     * @param {Object} action - Redux action containing the payload with companies array
     * @param {Array} action.payload - Array of company objects
     */
    setCompanies: (state, action) => {
      state.companies = Array.isArray(action.payload) ? action.payload : [];
    },

    /**
     * Updates the company search filter text
     * @param {Object} state - Current Redux state
     * @param {Object} action - Redux action containing the payload with search text
     * @param {string} action.payload - The search text
     */
    setSearchCompanyByText: (state, action) => {
      state.searchCompanyByText = action.payload || "";
    },
    
    /**
     * Clears the currently selected company
     * @param {Object} state - Current Redux state
     */
    clearSingleCompany: (state) => {
      state.singleCompany = {};
    },
  },
});

// Export action creators
export const { 
  setSingleCompany, 
  setCompanies,  
  setSearchCompanyByText,
  clearSingleCompany
} = companySlice.actions;

// Selectors
export const selectSingleCompany = (state) => state.company.singleCompany;
export const selectAllCompanies = (state) => state.company.companies;
export const selectSearchCompanyText = (state) => state.company.searchCompanyByText;

// Export the reducer as default
export default companySlice.reducer;

// Export the slice for potential use in other files
export { companySlice };
