
/**
 * Header Component
 * 
 * The main header component that appears at the top of the homepage.
 * Features a hero section with a search bar for job searches.
 * 
 * Features:
 * - Responsive hero section with gradient background
 * - Search functionality that navigates to the browse page
 * - Decorative badge and call-to-action elements
 * - Mobile-friendly design
 * 
 * State:
 * - query: Tracks the search input value
 * 
 * @returns {JSX.Element} The rendered Header component
 */

import React, { useState } from "react";
import { Button } from "../ui/button";
import { PiBuildingOfficeBold } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  // Local state for search query input
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Handles the job search submission
   * Dispatches the search query to Redux and navigates to the browse page
   */
  const searchjobHandler = () => {
    if (query.trim()) {
      dispatch(setSearchedQuery(query.trim()));
      navigate("/browse");
    }
  };
  
  /**
   * Handles the Enter key press in the search input
   * @param {React.KeyboardEvent} e - The keyboard event
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchjobHandler();
    }
  };

  return (
    <div className="py-5" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center position-relative" style={{ zIndex: 2 }}>
            <div className="d-flex flex-column gap-4">
              {/* Badge */}
              <div
                className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill fw-semibold mx-auto position-relative"
                style={{
                  display: 'inline-flex',
                  background: '#111827',
                  border: '1px solid rgba(255,255,255,0.35)',
                  color: '#ffffff',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
                  zIndex: 3,
                }}
              >
                <PiBuildingOfficeBold className="fs-5 position-relative" style={{ zIndex: 4 }} />
                <span style={{ fontSize: '16px', fontWeight: 700, position: 'relative', zIndex: 4 }}>India's No.1 Job Portal</span>
              </div>

              {/* Main Heading */}
              <h1
                className="display-3 fw-bold mb-3 text-white position-relative"
                style={{ zIndex: 2, textShadow: '0 2px 8px rgba(0,0,0,0.35)' }}
              >
                Search, Apply & <br />
                Get Your <span className="text-warning">Dream Job</span>
              </h1>

              {/* Subtitle */}
              <p className="lead mb-4 opacity-75">
                Discover life-changing career opportunities in your area. <br />
                Apply quickly and get hired faster with our comprehensive job portal.
              </p>

              {/* Search Bar */}
              <div className="d-flex shadow-lg rounded-pill bg-white p-2 mx-auto" style={{maxWidth: '500px'}}>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Find Your Dream Job..."
                  className="form-control border-0 shadow-none"
                  style={{borderRadius: '25px 0 0 25px'}}
                  aria-label="Search jobs"
                />
                <Button 
                  onClick={searchjobHandler} 
                  className="btn btn-primary rounded-end-pill px-4"
                  style={{borderRadius: '0 25px 25px 0'}}
                >
                  <i className="bi bi-search me-2"></i>
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
