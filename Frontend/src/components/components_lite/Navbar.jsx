/**
 * Navbar Component
 * 
 * The main navigation bar component that appears at the top of all pages.
 * Handles authentication state and provides navigation links based on user role.
 * 
 * Features:
 * - Responsive design with mobile menu
 * - Dynamic navigation items based on user role (Student/Recruiter/Admin)
 * - User profile dropdown with photo and quick actions
 * - Logout functionality with error handling
 * 
 * Dependencies:
 * - React Router for navigation
 * - Redux for state management
 * - Axios for API calls
 * - Sonner for toast notifications
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";

/**
 * Constructs a complete profile photo URL from a potentially relative path
 * @param {string} rawUrl - The raw URL or path from the user's profile
 * @returns {string} The complete URL to the profile photo
 */
const getProfilePhotoUrl = (rawUrl) => {
  if (!rawUrl) {
    return "";
  }
  // Return as-is if it's already a full URL
  if (rawUrl.startsWith("http")) {
    return rawUrl;
  }
  // Handle relative paths by prepending the API base URL
  return `https://jobportal-k289.onrender.com${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`;
};

/**
 * Main Navbar component
 * Renders the navigation bar with dynamic content based on authentication state and user role
 */
const Navbar = () => {
  // Get user data from Redux store
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Handles user logout
   * - Calls the logout API endpoint
   * - Clears user data from Redux store and localStorage
   * - Navigates to home page
   * - Shows toast notification on success/error
   */
  const logoutHandler = async () => {
    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/logout`, {}, { withCredentials: true });
      if (res?.data?.success) {
        // Clear user from Redux store
        dispatch(setUser(null));
        
        // Clear localStorage to remove persisted data
        localStorage.removeItem('persist:root');
        
        // Navigate to home
        navigate("/");
        
        // Show success message
        toast.success("Logged out successfully!");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Even if backend fails, clear local data
      dispatch(setUser(null));
      localStorage.removeItem('persist:root');
      navigate("/");
      toast.error("Logout failed, but you've been logged out locally");
    }
  };

  return (
    /**
     * Main Navigation Bar
     * - Uses Bootstrap's navbar component with sticky positioning
     * - Includes responsive breakpoints for mobile/desktop views
     * - Features a collapsible menu on mobile devices
     */
    <nav 
      className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top"
      aria-label="Main navigation"
    >
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand fw-bold fs-3 text-decoration-none" to="/">
          <span className="text-primary">Job</span>
          <span className="text-success">Portal</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link fw-medium px-3" to="/">
                <i className="bi bi-house me-1"></i>Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium px-3" to="/browse">
                <i className="bi bi-search me-1"></i>Browse
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium px-3" to="/Jobs">
                <i className="bi bi-briefcase me-1"></i>Jobs
              </Link>
            </li>
            {user?.role === "Student" && (
              <li className="nav-item">
                <Link className="nav-link fw-medium px-3" to="/saved">
                  <i className="bi bi-bookmark me-1"></i>Saved
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link fw-medium px-3" to="/creator">
                <i className="bi bi-info-circle me-1"></i>About
              </Link>
            </li>
          </ul>

          {/* Auth Buttons / User Menu */}
          {!user ? (
            <div className="d-flex gap-2">
              <Link className="btn btn-outline-primary px-4 py-2 fw-medium" to="/login">
                <i className="bi bi-box-arrow-in-right me-1"></i>Login
              </Link>
              <Link className="btn btn-primary px-4 py-2 fw-medium" to="/register">
                <i className="bi bi-person-plus me-1"></i>Register
              </Link>
            </div>
          ) : (
            <div className="dropdown">
              <button 
                className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2" 
                type="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                {/* Profile Photo */}
                <div className="position-relative">
                  {user?.profile?.profilePhoto ? (
                    <img 
                      src={getProfilePhotoUrl(user.profile.profilePhoto)} 
                      alt="Profile" 
                      className="rounded-circle"
                      style={{
                        width: '32px', 
                        height: '32px', 
                        objectFit: 'cover',
                        border: '2px solid #fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      onError={(e) => {
                        console.log('❌ Profile photo failed to load in navbar button');
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      onLoad={() => {
                        console.log('✅ Profile photo loaded successfully in navbar button');
                      }}
                    />
                  ) : null}
                  {/* <div 
                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                    style={{
                      width: '32px', 
                      height: '32px',
                      color: '#fff',
                      fontSize: '14px',
                      display: 'none' // Always hide icon when photo is present
                    }}
                  >
                    <i className="bi bi-person"></i>
                  </div> */}
                </div>
                <span className="fw-medium">{user.fullname}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0" style={{minWidth: '250px'}}>
                
                <li className="px-3 py-2 border-bottom">
                  <div className="d-flex align-items-center gap-3">
                    <div className="position-relative">
                      {user?.profile?.profilePhoto ? (
                        <img 
                          src={user.profile.profilePhoto} 
                          alt="Profile" 
                          className="rounded-circle"
                          style={{
                            width: '48px', 
                            height: '48px', 
                            objectFit: 'cover',
                            border: '2px solid #e9ecef'
                          }}
                          onError={(e) => {
                            console.log('❌ Profile photo failed to load in dropdown');
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                          onLoad={() => {
                            console.log('✅ Profile photo loaded successfully in dropdown');
                          }}
                        />
                      ) : null}
                      {/* <div 
                        className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                        style={{
                          width: '48px', 
                          height: '48px',
                          color: '#fff',
                          fontSize: '20px',
                          display: 'none' // Always hide icon when photo is present
                        }}
                      >
                        <i className="bi bi-person"></i>
                      </div> */}
                    </div>
                    <div>
                      <div className="fw-bold text-dark">{user.fullname}</div>
                      <div className="text-muted small">{user.email}</div>
                      <div className="badge bg-primary mt-1">{user.role}</div>
                    </div>
                  </div>
                </li>
                
                {user.role === "Student" && (
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to="/profile">
                      <i className="bi bi-person"></i>Profile
                    </Link>
                  </li>
                )}
                {user.role === "Student" && (
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to="/profile#applications">
                      <i className="bi bi-briefcase"></i>My Applications
                    </Link>
                  </li>
                )}
                {user.role === "Recruiter" && (
                  <>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2" to="/recruiter-profile">
                        <i className="bi bi-person"></i>Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2" to="/admin/companies">
                        <i className="bi bi-building"></i>Companies
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2" to="/admin/jobs">
                        <i className="bi bi-briefcase"></i>Jobs
                      </Link>
                    </li>
                  </>
                )}
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button 
                    className="dropdown-item d-flex align-items-center gap-2 text-danger" 
                    onClick={logoutHandler}
                  >
                    <i className="bi bi-box-arrow-right"></i>Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
