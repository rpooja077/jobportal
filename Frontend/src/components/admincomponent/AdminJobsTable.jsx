import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AdminJobsTable = ({ onSavedJobsChange, savedJobs = new Set() }) => {
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company
  );
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.jobs);
  const navigate = useNavigate();

  const [filterJobs, setFilterJobs] = useState(allAdminJobs);

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
      toast.success("Job removed from saved jobs");
    } else {
      newSavedJobs.add(jobId);
      toast.success("Job saved successfully!");
    }
    
    // Notify parent component about the change
    if (onSavedJobsChange) {
      onSavedJobsChange(newSavedJobs);
    }
  };

  useEffect(() => {
    const filteredJobs =
      allAdminJobs.length >= 0 &&
      allAdminJobs.filter((job) => {
        if (!searchJobByText) {
          return true;
        }
        return (
          job.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
          job?.company?.name
            ?.toLowerCase()
            .includes(searchJobByText.toLowerCase()) ||
          job?.location?.toLowerCase().includes(searchJobByText.toLowerCase())
        );
      });
    setFilterJobs(filteredJobs);
    console.log('Filtered jobs:', filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  console.log('AdminJobsTable render:', {
    allAdminJobs: allAdminJobs?.length || 0,
    filterJobs: filterJobs?.length || 0,
    savedJobs: savedJobs?.size || 0,
    onSavedJobsChange: !!onSavedJobsChange
  });

  if (!allAdminJobs) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <caption className="py-4 text-muted fw-medium">
          Your posted jobs ({filterJobs?.length || 0} jobs)
        </caption>
        <thead>
          <tr className="table-light">
            <th className="fw-semibold text-dark">Company</th>
            <th className="fw-semibold text-dark">Job Title</th>
            <th className="fw-semibold text-dark">Location</th>
            <th className="fw-semibold text-dark">Salary</th>
            <th className="fw-semibold text-dark">Posted Date</th>
            <th className="fw-semibold text-dark">Status</th>
            <th className="text-end fw-semibold text-dark">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filterJobs && filterJobs.length > 0 ? (
            filterJobs.map((job) => (
              <tr key={job._id} className="align-middle">
                <td>
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center justify-content-center">
                      {job?.company?.logo ? (
                        <img
                          src={job.company.logo}
                          alt={`${job.company.name} logo`}
                          className="rounded"
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'cover',
                            border: '2px solid #e9ecef'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="rounded d-flex align-items-center justify-content-center bg-light text-muted"
                        style={{
                          width: '40px',
                          height: '40px',
                          display: job?.company?.logo ? 'none' : 'flex'
                        }}
                      >
                        <i className="bi bi-building small"></i>
                      </div>
                    </div>
                    <div>
                      <h6 className="fw-semibold text-dark mb-1">{job?.company?.name || "N/A"}</h6>
                      <small className="text-muted">{job?.company?._id?.slice(-8)}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <h6 className="fw-semibold text-dark mb-1">{job.title || "N/A"}</h6>
                    <small className="text-muted">{job.jobType || "Full-time"}</small>
                  </div>
                </td>
                <td className="text-muted">
                  <div className="d-flex align-items-center gap-1">
                    <i className="bi bi-geo-alt text-primary"></i>
                    {job.location || "Remote"}
                  </div>
                </td>
                <td>
                  <span className="badge bg-success bg-opacity-10 text-success">
                    {job.salary ? `${job.salary} LPA` : "Not specified"}
                  </span>
                </td>
                <td className="text-muted">
                  {job.createdAt ? 
                    new Date(job.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : "N/A"
                  }
                </td>
                <td>
                  {(() => {
                    const created = job.createdAt ? new Date(job.createdAt) : null;
                    const isExpired = created ? ( (new Date() - created) / (1000*60*60*24) > 30 ) : false;
                    return isExpired ? (
                      <span className="badge bg-secondary">
                        <i className="bi bi-hourglass-split me-1"></i>
                        Expired
                      </span>
                    ) : (
                      <span className="badge bg-primary bg-opacity-10 text-primary">
                        <i className="bi bi-eye me-1"></i>
                        Active
                      </span>
                    );
                  })()}
                  {job.applications && job.applications.length > 0 && (
                    <div className="mt-1">
                      <span className="badge bg-success bg-opacity-10 text-success small">
                        <i className="bi bi-people me-1"></i>
                        {job.applications.length} Applications
                      </span>
                    </div>
                  )}
                </td>
                <td className="text-end">
                  <div className="d-flex gap-2 justify-content-end">

                    {/* View Detailed Job Button */}
                    <button
                      onClick={() => {
                        console.log('View Details clicked for job:', job._id);
                        console.log('Job object:', job);
                        console.log('About to navigate to:', `/job/${job._id}`);
                        alert('View Details clicked! Job ID: ' + job._id + '\nNavigating to: /job/' + job._id);
                        try {
                          navigate(`/job/${job._id}`);
                          console.log('Navigation successful');
                        } catch (error) {
                          console.error('Navigation error:', error);
                          alert('Navigation failed: ' + error.message);
                        }
                      }}
                      className="btn btn-primary btn-sm"
                      title="View Detailed Job"
                      style={{cursor: 'pointer'}}
                    >
                      <i className="bi bi-eye me-1"></i>
                      View Details
                    </button>

                    {/* Save Job Button */}
                    <button
                      onClick={() => {
                        console.log('Save Job clicked for job:', job._id);
                        alert('Save Job clicked! Job ID: ' + job._id);
                        toggleSaveJob(job._id);
                      }}
                      className={`btn btn-sm ${savedJobs.has(job._id) ? 'btn-success' : 'btn-outline-success'}`}
                      title={savedJobs.has(job._id) ? "Remove from saved" : "Save job"}
                      style={{cursor: 'pointer'}}
                    >
                      <i className={`bi ${savedJobs.has(job._id) ? 'bi-bookmark-fill' : 'bi-bookmark'} me-1`}></i>
                      {savedJobs.has(job._id) ? 'Saved' : 'Save'}
                    </button>

                    {/* Direct View Applicants Button */}
                    <button
                      onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                      className="btn btn-success btn-sm"
                      title="View Applicants"
                    >
                      <i className="bi bi-people me-1"></i>
                      View Applicants
                    </button>
                    
                    {/* More Actions Dropdown */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="btn btn-outline-secondary btn-sm">
                          <i className="bi bi-three-dots"></i>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="p-3" style={{minWidth: '180px'}}>
                        <div className="mb-2">
                          <h6 className="fw-medium text-dark mb-2">Job Actions</h6>
                          <button
                            onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                            className="btn btn-link text-decoration-none p-2 w-100 text-start"
                          >
                            <i className="bi bi-pencil me-2 text-primary"></i>
                            Edit Job
                          </button>
                          <button
                            onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                            className="btn btn-link text-decoration-none p-2 w-100 text-start"
                          >
                            <i className="bi bi-people me-2 text-success"></i>
                            View Applicants ({job.applications?.length || 0})
                          </button>
                          <button
                            onClick={() => navigate(`/admin/companies/${job.company?._id}`)}
                            className="btn btn-link text-decoration-none p-2 w-100 text-start"
                          >
                            <i className="bi bi-building me-2 text-info"></i>
                            Company Details
                          </button>
                          <hr className="my-2" />
                          <button
                            onClick={() => toggleSaveJob(job._id)}
                            className="btn btn-link text-decoration-none p-2 w-100 text-start"
                          >
                            <i className={`bi ${savedJobs.has(job._id) ? 'bi-bookmark-fill text-success' : 'bi-bookmark text-muted'} me-2`}></i>
                            {savedJobs.has(job._id) ? 'Remove from Saved' : 'Save Job'}
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-5 text-muted">
                <div className="d-flex flex-column align-items-center gap-3">
                  <i className="bi bi-briefcase text-muted" style={{fontSize: '3rem'}}></i>
                  <h5 className="fw-medium">No jobs found</h5>
                  <p className="small mb-0">
                    {searchJobByText ? 
                      `No jobs match "${searchJobByText}"` : 
                      "Start by posting your first job"
                    }
                  </p>
                  {!searchJobByText && (
                    <button 
                      onClick={() => navigate("/admin/jobs/create")}
                      className="btn btn-success btn-sm"
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Post Job
                    </button>
                  )}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminJobsTable;
