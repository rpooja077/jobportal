/**
 * authSlice.js
 * 
 * Redux slice for managing authentication state in the application.
 * This slice handles user authentication state including loading states and user data.
 * 
 * State Structure:
 * - loading: Boolean indicating if an authentication operation is in progress
 * - user: Object containing the authenticated user's data or null if not authenticated
 */

import { createSlice } from "@reduxjs/toolkit";

/**
 * Initial state for the auth slice
 * @type {Object}
 */
const initialState = {
  loading: false,  // Indicates if an auth operation is in progress
  user: null,      // Authenticated user data or null
};

/**
 * Redux slice for authentication state management
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Sets the loading state for authentication operations
     * @param {Object} state - Current Redux state
     * @param {Object} action - Redux action containing the payload with loading state
     * @param {boolean} action.payload - The new loading state
     */
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    /**
     * Updates the authenticated user data
     * @param {Object} state - Current Redux state
     * @param {Object} action - Redux action containing the payload with user data
     * @param {Object|null} action.payload - The user data object or null to clear authentication
     */
    setUser: (state, action) => {
      state.user = action.payload;
      
      // Clear loading state when user is set (either to a user or null)
      state.loading = false;
    },
    
    /**
     * Clears the authentication state (logs out the user)
     * @param {Object} state - Current Redux state
     */
    clearAuth: (state) => {
      state.user = null;
      state.loading = false;
    }
  },
});

// Export action creators
export const { 
  setLoading, 
  setUser, 
  clearAuth 
} = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => !!state.auth.user;
export const selectIsLoading = (state) => state.auth.loading;

// Export the reducer as default
export default authSlice.reducer;

// Export the reducer with a named export as well
export const authReducer = authSlice.reducer;
