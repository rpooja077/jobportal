import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import JobCards from "./JobCards";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { toast } from "sonner";

const Browse = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((store) => store.jobs);
  const dispatch = useDispatch();
  
  // Filter states
  const [filters, setFilters] = useState({
    location: '',
    salaryMin: '',
    salaryMax: '',
    jobType: '',
    experienceLevel: '',
    fresher: false,
    searchQuery: ''
  });


  // Get unique values for filter options - properly filtered and sorted
  const uniqueLocations = [...new Set(allJobs
    .map(job => job.location)
    .filter(location => location && location.trim() !== '')
    .sort()
  )];
  
  const uniqueJobTypes = [...new Set(allJobs
    .map(job => job.jobType)
    .filter(type => type && type.trim() !== '')
    .sort()
  )];
  
  const uniqueExperienceLevels = [...new Set(allJobs
    .map(job => job.experienceLevel)
    .filter(level => level && level !== null && level !== undefined)
    .sort((a, b) => a - b)
  )];

  // Filter jobs based on selected filters
  const filteredJobs = allJobs.filter(job => {
    // Location filter - case insensitive and exact match
    if (filters.location && job.location) {
      if (job.location.toLowerCase() !== filters.location.toLowerCase()) {
        return false;
      }
    }
    
    // Job Type filter - case insensitive and exact match
    if (filters.jobType && job.jobType) {
      if (job.jobType.toLowerCase() !== filters.jobType.toLowerCase()) {
        return false;
      }
    }
    
    // Fresher shortcut filter: allow jobs with experience 0 or 1 year, or keyword 'fresher'
    if (filters.fresher) {
      const exp = job.experienceLevel !== undefined && job.experienceLevel !== null
        ? parseInt(job.experienceLevel)
        : null;
      const hasFresherKeyword = (
        (job.title || '').toLowerCase().includes('fresher') ||
        (job.description || '').toLowerCase().includes('fresher')
      );
      if (!(hasFresherKeyword || (exp !== null && exp <= 1))) {
        return false;
      }
    }

    // Experience Level filter - exact match (works alongside fresher if user sets both)
    if (filters.experienceLevel && job.experienceLevel !== undefined && job.experienceLevel !== null) {
      if (parseInt(job.experienceLevel) !== parseInt(filters.experienceLevel)) {
        return false;
      }
    }
    
    // Salary range filters - improved logic
    if (filters.salaryMin && filters.salaryMin.trim() !== '') {
      const minSalary = parseInt(filters.salaryMin);
      if (isNaN(minSalary) || minSalary < 0) return false;
      
      if (job.salary) {
        const jobSalary = parseInt(job.salary);
        if (isNaN(jobSalary) || jobSalary < minSalary) {
          return false;
        }
      }
    }
    
    if (filters.salaryMax && filters.salaryMax.trim() !== '') {
      const maxSalary = parseInt(filters.salaryMax);
      if (isNaN(maxSalary) || maxSalary < 0) return false;
      
      if (job.salary) {
        const jobSalary = parseInt(job.salary);
        if (isNaN(jobSalary) || jobSalary > maxSalary) {
          return false;
        }
      }
    }
    
    // Search query filter - improved search including salary
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase().trim();
      const title = job.title ? job.title.toLowerCase() : '';
      const description = job.description ? job.description.toLowerCase() : '';
      const company = job.company?.name ? job.company.name.toLowerCase() : '';
      const location = job.location ? job.location.toLowerCase() : '';
      const jobType = job.jobType ? job.jobType.toLowerCase() : '';
      const salary = job.salary ? job.salary.toString() : '';
      
      // Check if query matches any of these fields
      const matchesTitle = title.includes(query);
      const matchesDescription = description.includes(query);
      const matchesCompany = company.includes(query);
      const matchesLocation = location.includes(query);
      const matchesJobType = jobType.includes(query);
      const matchesSalary = salary.includes(query);
      
      // Also check for salary-related keywords
      const salaryKeywords = ['lpa', 'lakh', 'salary', 'package', 'ctc', 'compensation'];
      const hasSalaryKeywords = salaryKeywords.some(keyword => 
        query.includes(keyword) || 
        title.includes(keyword) || 
        description.includes(keyword)
      );
      
      if (!matchesTitle && !matchesDescription && !matchesCompany && 
          !matchesLocation && !matchesJobType && !matchesSalary && !hasSalaryKeywords) {
        return false;
      }
    }
    
    return true;
  });

  const handleFilterChange = (filterType, value) => {
    // Prevent negative values for salary fields
    if ((filterType === 'salaryMin' || filterType === 'salaryMax') && value !== '') {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0) {
        return; // Don't update if negative or invalid
      }
    }
    
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      salaryMin: '',
      salaryMax: '',
      jobType: '',
      experienceLevel: '',
      fresher: false,
      searchQuery: ''
    });
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  
  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, []);

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      
      <div className="container py-5">
        {/* Page Header */}
        <div className="text-center mb-5">
          <div className="position-relative">
          <h1 className="display-5 fw-bold text-dark mb-3">
            <span className="text-primary">Browse</span> All Jobs
          </h1>
            <div className="position-absolute top-0 end-0">
              <span className="badge bg-primary fs-6 px-3 py-2">
                <i className="bi bi-briefcase me-1"></i>
                {allJobs.length} Total Jobs
              </span>
            </div>
          </div>
          <p className="lead text-muted">
            Discover thousands of opportunities from top companies across India
          </p>
          <div className="mt-3">
            <span className="badge bg-success bg-opacity-10 text-success border border-success me-2">
              <i className="bi bi-check-circle me-1"></i>
              Real-time Updates
            </span>
            <span className="badge bg-info bg-opacity-10 text-info border border-info me-2">
              <i className="bi bi-geo-alt me-1"></i>
              Location-based
            </span>
            <span className="badge bg-warning bg-opacity-10 text-warning border border-warning">
              <i className="bi bi-star me-1"></i>
              Save & Apply
            </span>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" 
                       style={{width: '50px', height: '50px'}}>
                    <i className="bi bi-funnel text-primary fs-4"></i>
                  </div>
                  <div>
                    <h5 className="card-title mb-1 fw-bold text-dark">Search & Filters</h5>
                    <p className="text-muted mb-0 small">Find your perfect job match</p>
                  </div>
                  <div className="ms-auto">
                    <span className="badge bg-light text-dark border">
                      <i className="bi bi-lightbulb me-1"></i>
                      Pro Tip: Use multiple filters for better results
                    </span>
                  </div>
                </div>
                
                {/* Search Bar */}
                <div className="row mb-4">
                  <div className="col-md-8">
                    <div className="input-group">
                      <span className="input-group-text bg-primary text-white border-0">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-0 shadow-none"
                        placeholder="Search jobs by title, description, company, location, salary (LPA), or job type..."
                        value={filters.searchQuery}
                        onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                        style={{fontSize: '1rem'}}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <button 
                      className="btn btn-outline-secondary w-100 h-100 d-flex align-items-center justify-content-center gap-2"
                      onClick={clearFilters}
                      disabled={!hasActiveFilters}
                    >
                      <i className="bi bi-arrow-clockwise"></i>
                      Clear All Filters
                    </button>
                  </div>
                </div>

                {/* Filter Options */}
                <div className="row g-3">
                  {/* Location Filter */}
                  <div className="col-lg-3 col-md-6">
                    <label className="form-label fw-semibold text-dark">
                      <i className="bi bi-geo-alt me-2 text-primary"></i>
                      Location
                    </label>
                    <select
                      className="form-select border-0 shadow-sm"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      style={{backgroundColor: '#f8f9fa'}}
                    >
                      <option value="">All Locations</option>
                      {uniqueLocations.map(location => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Job Type Filter */}
                  <div className="col-lg-3 col-md-6">
                    <label className="form-label fw-semibold text-dark">
                      <i className="bi bi-briefcase me-2 text-success"></i>
                      Job Type
                    </label>
                    <select
                      className="form-select border-0 shadow-sm"
                      value={filters.jobType}
                      onChange={(e) => handleFilterChange('jobType', e.target.value)}
                      style={{backgroundColor: '#f8f9fa'}}
                    >
                      <option value="">All Types</option>
                      {uniqueJobTypes.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Experience Level Filter */}
                  <div className="col-lg-3 col-md-6">
                    <label className="form-label fw-semibold text-dark">
                      <i className="bi bi-clock me-2 text-info"></i>
                      Experience
                    </label>
                    <select
                      className="form-select border-0 shadow-sm"
                      value={filters.experienceLevel}
                      onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                      style={{backgroundColor: '#f8f9fa'}}
                    >
                      <option value="">All Levels</option>
                      {uniqueExperienceLevels.map(level => (
                        <option key={level} value={level}>
                          {level} Years
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Fresher Quick Filter */}
                  <div className="col-lg-3 col-md-6 d-flex align-items-end">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="fresherFilter"
                        checked={filters.fresher}
                        onChange={(e) => handleFilterChange('fresher', e.target.checked)}
                      />
                      <label className="form-check-label fw-semibold text-dark" htmlFor="fresherFilter">
                        <i className="bi bi-person-check me-2 text-info"></i>
                        Fresher Friendly
                      </label>
                    </div>
                  </div>

                  {/* Salary Range Filter */}
                  <div className="col-lg-3 col-md-6">
                    <label className="form-label fw-semibold text-dark">
                      <i className="bi bi-currency-rupee me-2 text-warning"></i>
                      Salary Range (LPA)
                    </label>
                    <div className="d-flex gap-2">
                      <input
                        type="number"
                        className="form-control border-0 shadow-sm"
                        placeholder="Min"
                        min="0"
                        value={filters.salaryMin}
                        onChange={(e) => handleFilterChange('salaryMin', e.target.value)}
                        style={{backgroundColor: '#f8f9fa'}}
                      />
                      <input
                        type="number"
                        className="form-control border-0 shadow-sm"
                        placeholder="Max"
                        min="0"
                        value={filters.salaryMax}
                        onChange={(e) => handleFilterChange('salaryMax', e.target.value)}
                        style={{backgroundColor: '#f8f9fa'}}
                      />
                    </div>
                    <small className="text-muted">Enter values in LPA (Lakhs Per Annum)</small>
                  </div>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="mt-4 pt-3 border-top">
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <small className="text-muted me-2">Active Filters:</small>
                      {filters.location && (
                        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2">
                          <i className="bi bi-geo-alt me-1"></i>
                          {filters.location}
                          <button 
                            className="btn btn-sm text-primary ms-2 p-0 border-0"
                            onClick={() => handleFilterChange('location', '')}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </span>
                      )}
                      {filters.jobType && (
                        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2">
                          <i className="bi bi-briefcase me-1"></i>
                          {filters.jobType}
                          <button 
                            className="btn btn-sm text-success ms-2 p-0 border-0"
                            onClick={() => handleFilterChange('jobType', '')}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </span>
                      )}
                      {filters.experienceLevel && (
                        <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-3 py-2">
                          <i className="bi bi-clock me-1"></i>
                          {filters.experienceLevel} Years
                          <button 
                            className="btn btn-sm text-info ms-2 p-0 border-0"
                            onClick={() => handleFilterChange('experienceLevel', '')}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </span>
                      )}
                      {(filters.salaryMin || filters.salaryMax) && (
                        <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-3 py-2">
                          <i className="bi bi-currency-rupee me-1"></i>
                          {filters.salaryMin || '0'} - {filters.salaryMax || '∞'} LPA
                          <button 
                            className="btn btn-sm text-warning ms-2 p-0 border-0"
                            onClick={() => {
                              handleFilterChange('salaryMin', '');
                              handleFilterChange('salaryMax', '');
                            }}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </span>
                      )}
                      {filters.searchQuery && (
                        <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-3 py-2">
                          <i className="bi bi-search me-1"></i>
                          "{filters.searchQuery}"
                          <button 
                            className="btn btn-sm text-secondary ms-2 p-0 border-0"
                            onClick={() => handleFilterChange('searchQuery', '')}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center bg-white rounded-3 p-3 shadow-sm">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" 
                     style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-briefcase text-primary"></i>
                </div>
                <div>
                  <h5 className="fw-bold text-dark mb-1">
                    {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Available
                  </h5>
                  {hasActiveFilters && (
                    <small className="text-muted">
                      Filtered from {allJobs.length} total jobs
                    </small>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Statistics */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="row g-3">
              <div className="col-md-3 col-6">
                <div className="bg-white rounded-3 p-3 shadow-sm text-center">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" 
                       style={{width: '50px', height: '50px'}}>
                    <i className="bi bi-briefcase text-primary fs-4"></i>
                  </div>
                  <h4 className="fw-bold text-dark mb-1">{filteredJobs.length}</h4>
                  <p className="text-muted mb-0 small">Available Jobs</p>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="bg-white rounded-3 p-3 shadow-sm text-center">
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" 
                       style={{width: '50px', height: '50px'}}>
                    <i className="bi bi-building text-success fs-4"></i>
                  </div>
                  <h4 className="fw-bold text-dark mb-1">
                    {[...new Set(filteredJobs.map(job => job.company?.name))].length}
                  </h4>
                  <p className="text-muted mb-0 small">Companies</p>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="bg-white rounded-3 p-3 shadow-sm text-center">
                  <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" 
                       style={{width: '50px', height: '50px'}}>
                    <i className="bi bi-geo-alt text-info fs-4"></i>
                  </div>
                  <h4 className="fw-bold text-dark mb-1">
                    {[...new Set(filteredJobs.map(job => job.location))].length}
                  </h4>
                  <p className="text-muted mb-0 small">Locations</p>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="bg-white rounded-3 p-3 shadow-sm text-center">
                  <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" 
                       style={{width: '50px', height: '50px'}}>
                    <i className="bi bi-bookmark text-warning fs-4"></i>
                  </div>
                  <h4 className="fw-bold text-dark mb-1">
                    {JSON.parse(localStorage.getItem('savedJobs') || '[]').length}
                  </h4>
                  <p className="text-muted mb-0 small">Saved Jobs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="bg-white rounded-3 p-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-2 fw-semibold text-dark">
                    <i className="bi bi-lightning me-2 text-warning"></i>
                    Quick Actions
                  </h6>
                  <p className="text-muted mb-0 small">Enhance your job search experience</p>
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-success btn-sm"
                    onClick={() => {
                      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
                      if (savedJobs.length > 0) {
                        window.location.href = '/saved';
                      } else {
                        toast.info("You haven't saved any jobs yet. Start browsing and save interesting positions!");
                      }
                    }}
                  >
                    <i className="bi bi-bookmark-star me-1"></i>
                    View Saved ({JSON.parse(localStorage.getItem('savedJobs') || '[]').length})
                  </button>
                  <button 
                    className="btn btn-outline-info btn-sm"
                    onClick={() => {
                      const hasActiveFilters = Object.values(filters).some(value => 
                        value !== '' && value !== false && value !== 0
                      );
                      if (hasActiveFilters) {
                        clearFilters();
                        toast.success("All filters cleared!");
                      } else {
                        toast.info("No active filters to clear");
                      }
                    }}
                  >
                    <i className="bi bi-funnel me-1"></i>
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Display */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-5">
            <div className="bg-white rounded-4 p-5 shadow-sm">
              <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-4" 
                   style={{width: '80px', height: '80px'}}>
                <i className="bi bi-search text-muted" style={{fontSize: '2rem'}}></i>
              </div>
              <h4 className="text-muted mb-3">
                {allJobs.length === 0 ? 'No Jobs Available' : 'No Jobs Match Your Filters'}
              </h4>
              <p className="text-muted mb-4">
                {allJobs.length === 0 
                  ? 'Check back later for new opportunities' 
                  : 'Try adjusting your filters or search terms to find more jobs'
                }
              </p>
              {allJobs.length > 0 && (
                <button 
                  className="btn btn-primary px-4 py-2"
                  onClick={clearFilters}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filteredJobs.map((job, index) => (
              <div key={job._id} className="col">
                <JobCards job={job} />
              </div>
            ))}
          </div>
        )}

        {/* Load More Section */}
        {filteredJobs.length > 12 && (
          <div className="text-center mt-5">
            <button className="btn btn-outline-primary btn-lg px-5 py-3 rounded-pill">
              <i className="bi bi-arrow-down me-2"></i>
              Load More Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
