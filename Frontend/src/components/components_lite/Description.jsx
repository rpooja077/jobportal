import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useParams } from "react-router-dom";
import { JOB_API_ENDPOINT, APPLICATION_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "@/redux/jobSlice";
import { toast } from "sonner";
import Navbar from "./Navbar";

const Description = () => {
  const params = useParams();
  const jobId = params.id;

  const { singleJob } = useSelector((store) => store.jobs);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useSelector((store) => store.auth);

  // 30-day expiry (client side only)
  const isExpired = (() => {
    const created = singleJob?.createdAt ? new Date(singleJob.createdAt) : null;
    if (!created) return false;
    const now = new Date();
    const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    return diffDays > 30;
  })();

  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_ENDPOINT}/apply/${jobId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsApplied(true);
        const updateSingleJob = {
          ...singleJob,
          applications: [...(singleJob.applications || []), { applicant: user?._id }],
        };
        dispatch(setSingleJob(updateSingleJob));
        console.log(res.data);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchSingleJobs = async () => {
      // Validate jobId before making API call
      if (!jobId || jobId === 'undefined') {
        console.error('Invalid job ID:', jobId);
        setError("Invalid job ID");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        console.log('Fetching job with ID:', jobId);
        const res = await axios.get(`${JOB_API_ENDPOINT}/get/${jobId}`, {
          withCredentials: true,
        });
        console.log("API Response:", res.data);
        if (res.data.status) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications?.some(
              (application) => application.applicant === user?._id
            ) || false
          );
        } else {
          setError("Failed to fetch jobs.");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        const errorMsg = error.response?.data?.message || error.message || "Failed to load job details";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleJobs();
  }, [jobId, dispatch, user?._id]);
  console.log("single jobs", singleJob);

  // Loading state
  if (loading) {
    return (
      <div className="min-vh-100 bg-light">
        <Navbar />
        <div className="container py-5">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4 className="mt-4 text-primary">Loading Job Details...</h4>
            <p className="text-muted">Please wait while we fetch the job information</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-vh-100 bg-light">
        <Navbar />
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center py-5">
                  <div className="text-danger mb-4">
                    <i className="bi bi-exclamation-triangle" style={{fontSize: '4rem'}}></i>
                  </div>
                  <h3 className="text-danger mb-3">Error Loading Job</h3>
                  <p className="text-muted mb-4">{error}</p>
                  <div className="d-flex gap-3 justify-content-center">
                    <button 
                      className="btn btn-primary btn-lg"
                      onClick={() => window.location.reload()}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Try Again
                    </button>
                    <button 
                      className="btn btn-outline-secondary btn-lg"
                      onClick={() => window.history.back()}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Go Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No job data
  if (!singleJob) {
    return (
      <div className="min-vh-100 bg-light">
        <Navbar />
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center py-5">
                  <div className="text-warning mb-4">
                    <i className="bi bi-briefcase" style={{fontSize: '4rem'}}></i>
                  </div>
                  <h3 className="text-warning mb-3">Job Not Found</h3>
                  <p className="text-muted mb-4">The job you're looking for doesn't exist or has been removed.</p>
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={() => window.history.back()}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      
      <div className="container py-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/browse" className="text-decoration-none">
                <i className="bi bi-house me-1"></i>
                Browse Jobs
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {singleJob?.title}
            </li>
          </ol>
        </nav>

        <div className="row">
          <div className="col-lg-8">
            {/* Main Job Card */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                {/* Job Header */}
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div className="flex-grow-1">
                    <h1 className="h2 fw-bold text-dark mb-3">{singleJob?.title}</h1>
                    <div className="d-flex align-items-center mb-3">
                      <div className="rounded bg-light d-flex align-items-center justify-content-center me-3" 
                           style={{width: 48, height: 48, overflow: 'hidden'}}>
                        {singleJob?.company?.logo ? (
                          <img 
                            src={singleJob?.company?.logo} 
                            alt={singleJob?.company?.name} 
                            className="img-fluid"
                            style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} 
                          />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center w-100 h-100 bg-primary bg-opacity-10 text-primary">
                            <i className="bi bi-building fs-4"></i>
                          </div>
                        )}
                      </div>
    <div>
                        <h5 className="fw-bold text-dark mb-1">{singleJob?.company?.name || 'Company Name'}</h5>
                        <p className="text-muted mb-0">
                          <i className="bi bi-geo-alt me-1"></i>
                {singleJob?.location}
                        </p>
                      </div>
            </div>
          </div>
                  <div className="ms-3">
            <Button
              onClick={isApplied || isExpired ? null : applyJobHandler}
              disabled={isApplied || isExpired}
                      className={`btn ${isExpired ? "btn-secondary disabled" : isApplied ? "btn-success disabled" : "btn-primary"} btn-lg px-4 py-2`}
              style={!isApplied ? {backgroundColor: '#6B3AC2', borderColor: '#6B3AC2'} : {}}
            >
                      {isExpired ? (
                        <>
                          <i className="bi bi-hourglass-split me-2"></i>
                          Expired
                        </>
                      ) : isApplied ? (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Already Applied
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send me-2"></i>
                          Apply Now
                        </>
                      )}
            </Button>
          </div>
        </div>

                {/* Job Badges */}
                <div className="d-flex flex-wrap gap-2 mb-4">
                  <span className="badge bg-primary text-white fw-bold px-3 py-2">
                    <i className="bi bi-people me-1"></i>
              {singleJob?.position} Open Positions
            </span>
                  <span className="badge text-white fw-bold px-3 py-2" style={{backgroundColor: '#FA4F09'}}>
                    <i className="bi bi-currency-rupee me-1"></i>
              {singleJob?.salary} LPA
            </span>
                  <span className="badge text-white fw-bold px-3 py-2" style={{backgroundColor: '#6B3AC2'}}>
                    <i className="bi bi-geo-alt me-1"></i>
                    {singleJob?.location}
            </span>
                  <span className="badge bg-dark text-white fw-bold px-3 py-2">
                    <i className="bi bi-briefcase me-1"></i>
              {singleJob?.jobType}
            </span>
                  <span className="badge bg-info text-white fw-bold px-3 py-2">
                    <i className="bi bi-clock me-1"></i>
                    {singleJob?.experienceLevel} Years Exp
            </span>
                </div>

                {/* Job Description */}
                <div className="border-bottom border-2 border-secondary pb-4 mb-4">
                  <h4 className="fw-bold mb-3 text-dark">
                    <i className="bi bi-file-text me-2 text-primary"></i>
                    Job Description
                  </h4>
                  <div className="bg-light p-3 rounded">
                    <p className="text-muted mb-0" style={{lineHeight: '1.8', fontSize: '1rem'}}>
                      {singleJob?.description}
                    </p>
                  </div>
                </div>

                {/* Job Requirements */}
                <div className="mb-4">
                  <h4 className="fw-bold mb-3 text-dark">
                    <i className="bi bi-list-check me-2 text-primary"></i>
                    Job Requirements
                  </h4>
                  <div className="row">
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          <strong>Role:</strong> {singleJob?.position} Open Positions
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          <strong>Location:</strong> {singleJob?.location}
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          <strong>Salary:</strong> {singleJob?.salary} LPA
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          <strong>Experience:</strong> {singleJob?.experienceLevel} Years
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          <strong>Job Type:</strong> {singleJob?.jobType}
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          <strong>Posted:</strong> {singleJob?.createdAt ? new Date(singleJob.createdAt).toLocaleDateString() : 'N/A'}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Company Info Card */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="bi bi-building me-2"></i>
                  Company Information
                </h5>
              </div>
              <div className="card-body">
                <div className="text-center mb-3">
                  <div className="rounded bg-light d-flex align-items-center justify-content-center mx-auto mb-3" 
                       style={{width: 80, height: 80, overflow: 'hidden'}}>
                    {singleJob?.company?.logo ? (
                      <img 
                        src={singleJob?.company?.logo} 
                        alt={singleJob?.company?.name} 
                        className="img-fluid"
                        style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} 
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center w-100 h-100 bg-primary bg-opacity-10 text-primary">
                        <i className="bi bi-building fs-1"></i>
                      </div>
                    )}
                  </div>
                  <h6 className="fw-bold text-dark">{singleJob?.company?.name || 'Company Name'}</h6>
                  <p className="text-muted mb-0">
                    <i className="bi bi-geo-alt me-1"></i>
                    {singleJob?.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Job Stats Card */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  <i className="bi bi-graph-up me-2"></i>
                  Job Statistics
                </h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-6">
                    <div className="border-end">
                      <h4 className="fw-bold text-primary mb-1">{singleJob?.applications?.length || 0}</h4>
                      <small className="text-muted">Total Applicants</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <h4 className="fw-bold text-success mb-1">{singleJob?.position || 1}</h4>
                    <small className="text-muted">Open Positions</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">
                  <i className="bi bi-lightning me-2"></i>
                  Quick Actions
                </h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-primary">
                    <i className="bi bi-bookmark me-2"></i>
                    Save Job
                  </button>
                  <button className="btn btn-outline-secondary">
                    <i className="bi bi-share me-2"></i>
                    Share Job
                  </button>
                  <button className="btn btn-outline-info">
                    <i className="bi bi-printer me-2"></i>
                    Print Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;
