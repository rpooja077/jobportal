import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "@/hooks/useGetAllJAdminobs";
import { setSearchJobByText } from "@/redux/jobSlice";
import { toast } from "sonner";

const AdminJobs = () => {
  useGetAllAdminJobs();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [showSavedJobs, setShowSavedJobs] = useState(false);
  const dispatch = useDispatch();
  const { allAdminJobs } = useSelector((store) => store.jobs);

  // Load saved jobs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedJobs');
    console.log('Loading saved jobs from localStorage:', saved);
    if (saved) {
      setSavedJobs(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save jobs to localStorage whenever savedJobs changes
  useEffect(() => {
    console.log('Saving jobs to localStorage:', [...savedJobs]);
    localStorage.setItem('savedJobs', JSON.stringify([...savedJobs]));
  }, [savedJobs]);

  // Get saved jobs data
  const savedJobsData = allAdminJobs.filter(job => savedJobs.has(job._id));
  console.log('Saved jobs data:', savedJobsData);
  console.log('All admin jobs:', allAdminJobs);
  console.log('Saved jobs set:', savedJobs);

  const removeFromSaved = (jobId) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      newSet.delete(jobId);
      toast.success("Job removed from saved jobs");
      return newSet;
    });
  };

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container py-5">
        {/* Header Section */}
        <div className="card shadow-lg border-0 mb-4">
          <div className="card-body p-5">
            <div className="d-flex align-items-center gap-4 mb-4">
              <div className="w-25 h-25 bg-success bg-gradient rounded-circle d-flex align-items-center justify-content-center">
                <i className="bi bi-briefcase text-white fs-1"></i>
              </div>
              <div>
                <h1 className="display-6 fw-bold text-dark mb-2">Manage Jobs</h1>
                <p className="lead text-muted mb-0">Create and manage job postings for your companies</p>
              </div>
            </div>

            {/* Search and Add Section */}
            <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-between">
              <div className="d-flex gap-3 flex-grow-1">
                <div className="position-relative flex-grow-1">
                  <Input
                    className="form-control form-control-lg"
                    placeholder="Search jobs by title, company, or location..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <i className="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button 
                  onClick={() => navigate("/admin/companies")}
                  className="btn btn-primary btn-lg px-4"
                >
                  <i className="bi bi-building me-2"></i>
                  Manage Companies
                </Button>
                <Button 
                  onClick={() => setShowSavedJobs(!showSavedJobs)}
                  className={`btn btn-lg px-4 ${showSavedJobs ? 'btn-warning' : 'btn-outline-warning'}`}
                >
                  <i className={`bi ${showSavedJobs ? 'bi-eye-slash' : 'bi-bookmark'} me-2`}></i>
                  {showSavedJobs ? 'Hide Saved' : `Saved Jobs (${savedJobs.size})`}
                </Button>
                <Button 
                  onClick={() => navigate("/admin/jobs/create")}
                  className="btn btn-success btn-lg px-4"
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Post New Job
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Jobs Section */}
        {showSavedJobs && (
          <div className="card shadow-lg border-0 mb-4">
            <div className="card-header bg-warning bg-opacity-10 border-0 py-3">
              <h5 className="mb-0 fw-bold text-warning">
                <i className="bi bi-bookmark-fill me-2"></i>
                Saved Jobs ({savedJobs.size})
              </h5>
            </div>
            <div className="card-body p-0">
              {savedJobsData.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-warning">
                      <tr>
                        <th className="fw-semibold text-dark">Company</th>
                        <th className="fw-semibold text-dark">Job Title</th>
                        <th className="fw-semibold text-dark">Location</th>
                        <th className="fw-semibold text-dark">Salary</th>
                        <th className="fw-semibold text-dark">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {savedJobsData.map((job) => (
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
                                  />
                                ) : (
                                  <div className="rounded d-flex align-items-center justify-content-center bg-light text-muted"
                                       style={{width: '40px', height: '40px'}}>
                                    <i className="bi bi-building small"></i>
                                  </div>
                                )}
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
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                onClick={() => navigate(`/job/${job._id}`)}
                                className="btn btn-primary btn-sm"
                                title="View Detailed Job"
                              >
                                <i className="bi bi-eye me-1"></i>
                                View Details
                              </button>
                              <button
                                onClick={() => removeFromSaved(job._id)}
                                className="btn btn-outline-danger btn-sm"
                                title="Remove from saved"
                              >
                                <i className="bi bi-bookmark-x me-1"></i>
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <div className="text-warning mb-3">
                    <i className="bi bi-bookmark" style={{fontSize: '3rem'}}></i>
                  </div>
                  <h5 className="fw-medium text-muted">No saved jobs yet</h5>
                  <p className="small text-muted mb-0">
                    Start saving jobs by clicking the bookmark icon next to any job
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Jobs Table */}
        <div className="card shadow-lg border-0">
          <div className="card-body p-0">
            <AdminJobsTable 
              savedJobs={savedJobs}
              onSavedJobsChange={setSavedJobs}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;
