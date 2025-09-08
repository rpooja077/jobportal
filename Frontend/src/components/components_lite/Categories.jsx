/**
 * Categories Component
 * 
 * Displays a grid of job categories that users can click to search for jobs.
 * 
 * Features:
 * - Responsive grid layout (2-4 columns based on screen size)
 * - Hover animations for better interactivity
 * - Clicking a category updates the search query and navigates to the browse page
 * - "View All Jobs" button for seeing all available positions
 * 
 * @returns {JSX.Element} The rendered Categories component
 */

import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";
 
// Available job categories to display
const JOB_CATEGORIES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mern Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Machine Learning Engineer",
  "Artificial Intelligence Engineer",
  "Cybersecurity Engineer",
  "Product Manager",
  "UX/UI Designer",
  "Graphics Engineer",
  "Graphics Designer",
  "Video Editor",
];

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  /**
   * Handles category click events
   * Updates the search query in Redux and navigates to the browse page
   * @param {string} query - The category to search for
   */
  const searchjobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="py-5">
      {/* Section Header */}
      <div className="text-center mb-5">
        <h2 className="display-6 fw-bold text-dark mb-3">
          Explore <span className="text-primary">Job Categories</span>
        </h2>
        <p className="lead text-muted">
          Discover opportunities in various fields and industries
        </p>
      </div>

      {/* Categories Grid - Responsive layout that adjusts based on screen size */}
      <div 
        className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3"
        role="list"
        aria-label="Job categories"
      >
        {JOB_CATEGORIES.map((category, index) => (
          <div key={category + index} className="col">
            <button
              onClick={() => searchjobHandler(category)}
              className="btn btn-outline-primary w-100 h-100 py-3 fw-medium text-start"
              style={{
                transition: 'all 0.3s ease',
                borderWidth: '2px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,123,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {category}
            </button>
          </div>
        ))}
      </div>

      {/* View All Button - Navigates to browse page with all jobs */}
      <div className="text-center mt-5" role="navigation" aria-label="View all jobs">
        <button
          onClick={() => navigate("/browse")}
          className="btn btn-primary btn-lg px-5 py-3 fw-semibold"
        >
          View All Jobs
        </button>
      </div>
    </div>
  );
};

export default Categories;
