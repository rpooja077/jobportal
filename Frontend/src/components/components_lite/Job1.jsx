import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Add custom styles for enhanced grid view
const cardStyles = {
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: '2px solid #000000',
  position: 'relative',
  overflow: 'hidden'
};

const cardHoverStyles = {
  transform: 'translateY(-5px)',
  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
  borderColor: '#007bff'
};

const cardNormalStyles = {
  transform: 'translateY(0)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  borderColor: '#000000'
};

const Job1 = ({ job }) => {
  console.log('Job1 received job:', job);
  console.log('Job1 job._id:', job?._id);
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  // Check if job is saved on component mount
  useEffect(() => {
    const jobId = job?._id || job?.id;
    if (jobId) {
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      setIsSaved(savedJobs.includes(jobId));
    }
  }, [job?._id, job?.id]);

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  // Handle save/unsave job
  const handleSaveJob = () => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    
    if (isSaved) {
      // Remove from saved
      const newSavedJobs = savedJobs.filter(id => id !== job._id);
      localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
      setIsSaved(false);
      toast.success("Job removed from saved jobs");
    } else {
      // Add to saved
      const newSavedJobs = [...savedJobs, job._id];
      localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
      setIsSaved(true);
      toast.success("Job saved successfully!");
    }
  };

  return (
    <div className="card h-100 shadow-sm border-0 position-relative overflow-hidden" 
         style={cardStyles}
         onMouseEnter={(e) => {
           Object.assign(e.currentTarget.style, cardHoverStyles);
         }}
         onMouseLeave={(e) => {
           Object.assign(e.currentTarget.style, cardNormalStyles);
         }}
         onClick={() => {
           console.log('Job1 onClick - job object:', job);
           console.log('Job1 onClick - job._id:', job?._id);
           console.log('Job1 onClick - job.id:', job?.id);
           
           const jobId = job?._id || job?.id;
           if (jobId) {
             console.log('Navigating to job ID:', jobId);
             navigate(`/job/${jobId}`);
           } else {
             console.error('Job ID is missing in both _id and id:', job);
           }
         }}
    >
      {/* Clickable Overlay Indicator */}
      <div className="position-absolute top-0 end-0 p-2" style={{zIndex: 1}}>
        <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" 
             style={{width: '24px', height: '24px'}}>
          <i className="bi bi-arrow-up-right text-primary" style={{fontSize: '0.75rem'}}></i>
        </div>
      </div>

      {/* Card Header */}
      <div className="card-header bg-transparent border-0 pb-0 pt-3">
        <div className="d-flex justify-content-between align-items-center">
          <span className="badge bg-light text-muted fw-normal">
            <i className="bi bi-clock me-1"></i>
            {daysAgoFunction(job?.createdAt) === 0
              ? "Today"
              : `${daysAgoFunction(job?.createdAt)} days ago`}
          </span>
          <button 
            className={`btn btn-sm rounded-circle ${isSaved ? 'btn-success' : 'btn-outline-secondary'}`} 
            style={{width: '32px', height: '32px'}}
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              handleSaveJob();
            }}
            title={isSaved ? "Remove from saved" : "Save job"}
          >
            <i className={`bi ${isSaved ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body p-4">
        {/* Company Info */}
        <div className="d-flex align-items-center mb-3">
          <div className="rounded bg-light d-flex align-items-center justify-content-center me-3 flex-shrink-0" 
               style={{width: 56, height: 56, overflow: 'hidden'}}>
            {job?.company?.logo ? (
              <img 
                src={job?.company?.logo} 
                alt={job?.company?.name} 
                className="img-fluid"
                style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} 
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center w-100 h-100 bg-primary bg-opacity-10 text-primary">
                <i className="bi bi-building fs-4"></i>
              </div>
            )}
          </div>
          <div className="flex-grow-1">
            <h6 className="card-title mb-1 fw-bold text-dark">{job?.company?.name}</h6>
            <p className="text-muted mb-0 small">
              <i className="bi bi-geo-alt me-1"></i>
              {job?.location || 'India'}
            </p>
          </div>
        </div>

        {/* Job Title */}
        <h5 className="fw-semibold mb-2 text-dark fs-6">{job?.title}</h5>
        
        {/* Job Description */}
        <p className="text-muted mb-3 small" style={{minHeight: '40px', lineHeight: '1.4'}}>
          {job?.description?.length > 100 
            ? `${job?.description.substring(0, 100)}...` 
            : job?.description}
        </p>

        {/* Job Details Badges */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          <span className="badge bg-primary text-white fw-normal">
            <i className="bi bi-people me-1"></i>
            {job?.position} Positions
          </span>
          <span className="badge bg-success text-white fw-normal">
            <i className="bi bi-currency-rupee me-1"></i>
            {job?.salary} LPA
          </span>
          <span className="badge bg-info text-white fw-normal">
            <i className="bi bi-briefcase me-1"></i>
            {job?.jobType}
          </span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="card-footer bg-transparent border-0 pt-0">
        <div className="d-flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              navigate(`/job/${job?._id}`);
            }}
            className="btn btn-outline-primary btn-sm flex-grow-1"
            style={{transition: 'all 0.2s ease'}}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.backgroundColor = '#007bff';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.backgroundColor = '';
              e.target.style.color = '';
            }}
          >
            <i className="bi bi-eye me-2"></i>
            View Details
          </button>
          <button 
            className={`btn btn-sm flex-grow-1 ${isSaved ? 'btn-success' : 'btn-primary'}`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              handleSaveJob();
            }}
            style={{transition: 'all 0.2s ease'}}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            <i className={`bi ${isSaved ? 'bi-bookmark-fill' : 'bi-bookmark'} me-2`}></i>
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Job1;
