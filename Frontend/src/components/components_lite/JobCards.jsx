/**
 * JobCards Component
 * 
 * A reusable component that displays job information in a card format.
 * 
 * Props:
 * - job: Object containing job details including company information
 * 
 * Features:
 * - Displays job title, company, location, and salary
 * - Allows saving/unsaving jobs (persists in localStorage)
 * - Handles navigation to job details page
 * - Responsive design for different screen sizes
 */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const JobCards = ({job}) => {
  // Debug logs for development (commented out in production)
  console.log('JobCard data:', job);
  console.log('Job ID:', job?._id);
  console.log('Company data:', job?.company);
  console.log('Logo URL:', job?.company?.logo);
  
  // Hook for programmatic navigation
  const navigate = useNavigate();
  
  // Redux hooks for authentication and dispatching actions
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((store) => store.auth);
  
  // State to track if job is saved
  const [isSaved, setIsSaved] = useState(false);

  /**
   * Effect to check if current job is in saved jobs list when component mounts
   * Runs whenever job._id or isAuthenticated changes
   */
  useEffect(() => {
    if (job?._id && isAuthenticated) {
      // Retrieve saved jobs from localStorage or initialize empty array
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      // Update isSaved state based on whether current job is in saved jobs
      setIsSaved(savedJobs.includes(job._id));
    }
  }, [job?._id, isAuthenticated]);

  /**
   * Handles click on View Details button
   * Navigates to the job details page
   */
  const handleViewDetails = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    
    // Debug logs
    console.log('JobCards onClick - job object:', job);
    console.log('JobCards onClick - job._id:', job?._id);
    console.log('JobCards onClick - job.id:', job?.id);
    
    // Get job ID from either _id or id property
    const jobId = job?._id || job?.id;
    
    if (jobId) {
      console.log('Navigating to job ID:', jobId);
      // Navigate to job details page
      navigate(`/job/${jobId}`);
    } else {
      console.error('Job ID is missing in both _id and id:', job);
    }
  };

  /**
   * Handles saving/unsaving a job
   * Toggles job save status and updates localStorage
   */
  const handleSaveJob = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please login to save jobs', {
        action: {
          label: 'Login',
          onClick: () => navigate('/login')
        }
      });
      return;
    }
    
    // Get job ID from either _id or id property
    const jobId = job?._id || job?.id;
    
    // Validate job ID exists
    if (!jobId) {
      console.error('Cannot save job - no valid ID found:', job);
      return;
    }
    
    // Get current saved jobs from localStorage
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    
    if (isSaved) {
      // If job is already saved, remove it from saved jobs
      const newSavedJobs = savedJobs.filter(id => id !== jobId);
      // Update localStorage with new saved jobs list
      localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
      
      // Also remove from savedJobsData which stores the full job objects
      const savedJobsData = JSON.parse(localStorage.getItem('savedJobsData') || '[]');
      const filteredData = savedJobsData.filter(j => (j._id || j.id) !== jobId);
      localStorage.setItem('savedJobsData', JSON.stringify(filteredData));
      
      // Update state to reflect job is no longer saved
      setIsSaved(false);
      console.log('Job removed from saved:', jobId);
    } else {
      // Add job ID to saved jobs list
      const newSavedJobs = [...savedJobs, jobId];
      localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
      
      // Also save the full job data for quick access in the saved jobs page
      const savedJobsData = JSON.parse(localStorage.getItem('savedJobsData') || '[]');
      // Only add if not already in the list to prevent duplicates
      if (!savedJobsData.some(j => (j._id || j.id) === jobId)) {
        // Ensure job object has _id field for consistency
        const jobToSave = { ...job, _id: jobId };
        savedJobsData.push(jobToSave);
        localStorage.setItem('savedJobsData', JSON.stringify(savedJobsData));
      }
      
      // Update state to reflect job is now saved
      setIsSaved(true);
      toast.success('Job saved successfully!');
    }
  };

  // Render the job card UI
  return (
    <div 
      className="card job-card h-100 border-0 shadow-sm hover-shadow transition-all"
      onClick={handleViewDetails} // Navigate to job details on card click
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleViewDetails(e)}
    >
      <div className="card-body p-4">
        {/* Job Header with Company Logo and Title */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center">
            {/* Company Logo - Show logo if available, otherwise show building icon */}
            {job?.company?.logo ? (
              <img 
                src={job.company.logo} 
                alt={`${job.company.name} logo`} 
                className="rounded me-3"
                style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                onError={(e) => {
                  // Fallback to building icon if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : (
              <div 
                className="bg-light rounded d-flex align-items-center justify-content-center me-3"
                style={{ width: '50px', height: '50px' }}
              >
                <i className="bi bi-building text-muted"></i>
              </div>
            )}
            {/* Job Title and Company Name */}
            <div>
              <h6 className="mb-1 fw-semibold">{job?.title || 'Job Title'}</h6>
              <p className="mb-0 text-muted small">
                {job?.company?.name || 'Company Name'}
              </p>
            </div>
          </div>
          {/* Save/Unsave Button - Only show if user is authenticated */}
          {isAuthenticated && (
            <button 
              className={`btn btn-icon ${isSaved ? 'text-warning' : 'text-muted'}`}
              onClick={handleSaveJob}
              aria-label={isSaved ? 'Unsave job' : 'Save job'}
            >
              <i className={`bi ${isSaved ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
            </button>
          )}
        </div>
        
        {/* Job Tags (Location, Job Type, Experience Level) */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          {job?.location && (
            <span className="badge bg-light text-dark border">
              <i className="bi bi-geo-alt me-1"></i> {job.location}
            </span>
          )}
          {job?.jobType && (
            <span className="badge bg-light text-dark border">{job.jobType}</span>
          )}
          {job?.experienceLevel && (
            <span className="badge bg-light text-dark border">{job.experienceLevel}</span>
          )}
        </div>
        
        {/* Salary and Apply Button */}
        <div className="d-flex justify-content-between align-items-center gap-3">
          {/* Salary Information */}
          <div className="flex-shrink-1 text-truncate" style={{minWidth: '120px'}}>
            {job?.salary && (
              <p className="mb-0 fw-medium text-primary text-truncate">
                {typeof job.salary === 'string' 
                  ? job.salary 
                  : `$${job.salary.min?.toLocaleString()} - $${job.salary.max?.toLocaleString()}`}
              </p>
            )}
          </div>
          {/* Apply Button */}
          <button 
            className="btn btn-sm btn-primary flex-shrink-0"
            onClick={handleViewDetails}
            style={{whiteSpace: 'nowrap'}}
          >
            <i className="bi bi-eye me-1"></i>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCards;
