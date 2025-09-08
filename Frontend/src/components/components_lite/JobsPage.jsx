import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const JobsPage = () => {
  const navigate = useNavigate();
  
  // State for filters and saved jobs
  const [filters, setFilters] = useState({
    location: "",
    jobType: ""
  });
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [savedJobsData, setSavedJobsData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);

  // Debug: Log when component mounts
  useEffect(() => {
    console.log('JobsPage component mounted - FRESH Jobs page loaded');
    
    // Load saved jobs from localStorage
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      setSavedJobs(new Set(JSON.parse(saved)));
    }
    const savedData = localStorage.getItem('savedJobsData');
    if (savedData) {
      try { setSavedJobsData(JSON.parse(savedData)); } catch {}
    }
  }, []);

  // Save jobs to localStorage whenever savedJobs changes
  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify([...savedJobs]));
  }, [savedJobs]);

  useEffect(() => {
    localStorage.setItem('savedJobsData', JSON.stringify(savedJobsData));
  }, [savedJobsData]);

  // Sample job data - completely independent from Browse
  const sampleJobs = [
    {
      id: "507f1f77bcf86cd799439011",
      title: "Frontend Developer",
      company: "Tech Solutions Inc",
      location: "Mumbai",
      jobType: "Full-time",
      salary: "8-12 LPA",
      description: "We are looking for a skilled Frontend Developer to join our team."
    },
    {
      id: "507f1f77bcf86cd799439012",
      title: "Backend Developer",
      company: "Digital Innovations",
      location: "Delhi",
      jobType: "Full-time",
      salary: "10-15 LPA",
      description: "Join our backend team to build scalable applications."
    },
    {
      id: "507f1f77bcf86cd799439013",
      title: "UI/UX Designer",
      company: "Creative Studio",
      location: "Bangalore",
      jobType: "Contract",
      salary: "6-10 LPA",
      description: "Create beautiful and functional user interfaces."
    },
    {
      id: "507f1f77bcf86cd799439014",
      title: "Data Scientist",
      company: "Analytics Corp",
      location: "Pune",
      jobType: "Full-time",
      salary: "12-18 LPA",
      description: "Work with big data and machine learning algorithms."
    },
    {
      id: "507f1f77bcf86cd799439015",
      title: "DevOps Engineer",
      company: "Cloud Systems",
      location: "Hyderabad",
      jobType: "Full-time",
      salary: "9-14 LPA",
      description: "Manage and optimize our cloud infrastructure."
    },
    {
      id: "507f1f77bcf86cd799439016",
      title: "Product Manager",
      company: "Innovation Labs",
      location: "Chennai",
      jobType: "Full-time",
      salary: "15-25 LPA",
      description: "Lead product development and strategy."
    }
  ];

  // Filter jobs based on current filters
  useEffect(() => {
    let filtered = sampleJobs;
    
    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.jobType) {
      filtered = filtered.filter(job => 
        job.jobType.toLowerCase() === filters.jobType.toLowerCase()
      );
    }
    
    setFilteredJobs(filtered);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle View Details
  const handleViewDetails = (job) => {
    console.log('View Details clicked for job:', job);
    setSelectedJob(job);
    setShowJobModal(true);
    // No toast here - modal will show job details
  };

  // Handle Save Job (supports both sample id and backend _id)
  const handleSaveJob = (jobOrId) => {
    const isObj = typeof jobOrId === 'object';
    const jobId = isObj ? (jobOrId._id || jobOrId.id) : jobOrId;
    console.log('🔍 Save job called for ID:', jobId);
    console.log('🔍 Current saved jobs:', savedJobs);
    
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
      console.log('🗑️ Removing job from saved');
      toast.success("Job removed from saved jobs");
      setSavedJobsData(prev => prev.filter(j => (j._id || j.id) !== jobId));
    } else {
      newSavedJobs.add(jobId);
      console.log('💾 Adding job to saved');
      toast.success("Job saved successfully!");
      if (isObj) {
        const minimal = {
          _id: jobOrId._id,
          id: jobOrId.id,
          title: jobOrId.title,
          company: jobOrId.company?.name || jobOrId.company,
          location: jobOrId.location,
          jobType: jobOrId.jobType,
          salary: jobOrId.salary,
          description: jobOrId.description
        };
        setSavedJobsData(prev => {
          const exists = prev.some(j => (j._id || j.id) === jobId);
          return exists ? prev : [...prev, minimal];
        });
      }
    }
    setSavedJobs(newSavedJobs);
  };

  // Handle Apply Filters
  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
    toast.success("Filters applied successfully!");
  };

  // Handle Load More
  const handleLoadMore = () => {
    toast.info("Load more functionality coming soon!");
  };

  return (
    <div className="min-vh-100" style={{backgroundColor: '#f8fafc'}}>
      <Navbar />
      
      <div className="container py-5">
        {/* Page Header - Completely different from Browse */}
        <div className="text-center mb-5">
          <div className="bg-primary text-white rounded-4 p-5 mb-4">
            <h1 className="display-5 fw-bold mb-3">Available Jobs</h1>
            <p className="lead mb-0">Find your next career opportunity</p>
          </div>
        </div>

        {/* Simple Filter Bar */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow">
              <div className="card-body p-4">
                <div className="row g-3 align-items-end">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">
                      <i className="bi bi-geo-alt me-2 text-primary"></i>
                      Location
                    </label>
                    <select className="form-select" value={filters.location} onChange={(e) => handleFilterChange('location', e.target.value)}>
                      <option value="">All Locations</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="delhi">Delhi</option>
                      <option value="bangalore">Bangalore</option>
                      <option value="pune">Pune</option>
                      <option value="hyderabad">Hyderabad</option>
                      <option value="chennai">Chennai</option>
                    </select>
                  </div>
                  
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">
                      <i className="bi bi-briefcase me-2 text-success"></i>
                      Job Type
                    </label>
                    <select className="form-select" value={filters.jobType} onChange={(e) => handleFilterChange('jobType', e.target.value)}>
                      <option value="">All Types</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  
                  <div className="col-md-4">
                    <button className="btn btn-primary w-100" onClick={handleApplyFilters}>
                      <i className="bi bi-funnel me-2"></i>
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center bg-white rounded p-4 shadow">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white" 
                     style={{width: '50px', height: '50px'}}>
                  <i className="bi bi-briefcase"></i>
                </div>
                <div>
                  <h5 className="fw-bold text-dark mb-1">
                    {filteredJobs.length} Position{filteredJobs.length !== 1 ? 's' : ''} Available
                  </h5>
                  <small className="text-muted">Browse through our current openings</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs List - Completely different from Browse */}
        <div className="row">
          <div className="col-12">
            {filteredJobs.map((job) => (
              <div key={job.id} className="mb-4">
                <div className="card border-0 shadow">
                  <div className="card-body p-4">
                    <div className="row align-items-center">
                      <div className="col-md-8">
                        <div className="d-flex align-items-start gap-3">
                          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0" 
                               style={{width: '70px', height: '70px'}}>
                            <i className="bi bi-briefcase fs-4"></i>
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="fw-bold text-dark mb-2">{job.title}</h5>
                            <p className="text-muted mb-2">
                              <i className="bi bi-building me-2"></i>
                              {job.company}
                            </p>
                            <p className="text-muted mb-3">{job.description}</p>
                            <div className="d-flex flex-wrap gap-3">
                              <span className="badge bg-light text-dark border">
                                <i className="bi bi-geo-alt me-1"></i>
                                {job.location}
                              </span>
                              <span className="badge bg-light text-dark border">
                                <i className="bi bi-briefcase me-1"></i>
                                {job.jobType}
                              </span>
                              <span className="badge bg-success text-white">
                                <i className="bi bi-currency-rupee me-1"></i>
                                {job.salary}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 text-md-end">
                        <button className="btn btn-primary btn-sm mb-2 w-100" onClick={() => handleViewDetails(job)}>
                          <i className="bi bi-eye me-1"></i>
                          View Details
                        </button>
                        <button className="btn btn-outline-secondary btn-sm w-100" onClick={() => handleSaveJob(job)}>
                          <i className="bi bi-heart me-1"></i>
                          {savedJobs.has(job._id || job.id) ? 'Unsave Job' : 'Save Job'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Load More Button */}
        <div className="text-center mt-5">
          <button className="btn btn-primary btn-lg px-5 py-3" onClick={handleLoadMore}>
            <i className="bi bi-arrow-down me-2"></i>
            Load More Positions
          </button>
        </div>
      </div>

      {/* Job Details Modal */}
      {showJobModal && selectedJob && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-briefcase me-2"></i>
                  Job Details
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowJobModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row">
                  <div className="col-md-8">
                    <h4 className="fw-bold text-dark mb-3">{selectedJob.title}</h4>
                    <p className="text-muted mb-3">
                      <i className="bi bi-building me-2"></i>
                      {selectedJob.company}
                    </p>
                    <p className="text-dark mb-4">{selectedJob.description}</p>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-light border-0">
                      <div className="card-body">
                        <h6 className="fw-bold text-dark mb-3">Job Information</h6>
                        <div className="mb-3">
                          <small className="text-muted d-block">Location</small>
                          <span className="fw-semibold text-dark">{selectedJob.location}</span>
                        </div>
                        <div className="mb-3">
                          <small className="text-muted d-block">Job Type</small>
                          <span className="fw-semibold text-dark">{selectedJob.jobType}</span>
                        </div>
                        <div className="mb-3">
                          <small className="text-muted d-block">Salary</small>
                          <span className="fw-semibold text-dark">{selectedJob.salary}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowJobModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
