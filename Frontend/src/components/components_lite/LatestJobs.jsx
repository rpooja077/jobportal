/**
 * LatestJobs Component
 * 
 * Displays a grid of the most recent job postings.
 * 
 * Features:
 * - Responsive grid layout (1-3 columns based on screen size)
 * - Shows up to 6 most recent jobs
 * - Handles empty state with a friendly message
 * - "View More" button when more than 6 jobs are available
 * - Error handling for invalid job data
 * 
 * @returns {JSX.Element} The rendered LatestJobs component
 */

import React from "react";
import JobCards from "./JobCards";
import { useSelector } from "react-redux";

const LatestJobs = () => {
  // Get jobs from Redux store with fallback to empty array
  const allJobs = useSelector((state) => state.jobs?.allJobs || []);

  return (
    <div>
      {/* Section Header with title and description */}
      <div className="text-center mb-5" role="region" aria-label="Latest job openings">
        <h2 className="display-5 fw-bold text-dark mb-3">
          <span className="text-primary">Latest & Top</span> Job Openings
        </h2>
        <p className="lead text-muted">
          Discover the most recent opportunities from top companies
        </p>
      </div>

      {/* Job Cards Grid - Responsive layout that adjusts based on screen size */}
      <div 
        className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"
        role="list"
        aria-label="List of latest job openings"
      >
        {allJobs.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-5">
              <div className="text-muted">
                <i className="bi bi-briefcase fs-1"></i>
                <p className="mt-3 fs-5">No jobs available at the moment</p>
                <p className="text-muted">Check back later for new opportunities</p>
              </div>
            </div>
          </div>
        ) : (
          allJobs
            .slice(0, 6)
            .map((job) =>
              job?._id ? (
                <div key={job._id} className="col">
                  <JobCards job={job} />
                </div>
              ) : (
                <div key={Math.random()} className="col">
                  <div className="alert alert-warning" role="alert">
                    Invalid Job Data
                  </div>
                </div>
              )
            )
        )}
      </div>

      {/* View More Button - Only shown when there are more than 6 jobs */}
      {allJobs.length > 6 && (
        <div className="text-center mt-5">
          <button className="btn btn-outline-primary btn-lg px-5 py-3 fw-semibold">
            View More Jobs
          </button>
        </div>
      )}
    </div>
  );
};

export default LatestJobs;
