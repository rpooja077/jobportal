import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import EditProfileModal from "./EditProfileModal";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import axios from "axios";
import { JOB_API_ENDPOINT, APPLICATION_API_ENDPOINT } from "@/utils/data";

// Normalize profile photo URL and guard against non-image values
const getProfilePhotoUrl = (rawUrl) => {
  if (!rawUrl) return "";
  // Avoid accidentally using resume/document URLs as images
  if (rawUrl.includes('.pdf') || rawUrl.includes('.doc') || rawUrl.includes('.txt')) return "";
  if (rawUrl.startsWith("http")) return rawUrl;
  return `https://jobportal-k289.onrender.com${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`;
};


const RecruiterProfile = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  // Real data for recruiter - will be fetched from API
  const [postedJobs, setPostedJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recruiter's data
  useEffect(() => {
    const fetchRecruiterData = async () => {
      try {
        setLoading(true);
        
        // Fetch posted jobs
        const jobsResponse = await axios.get(`${JOB_API_ENDPOINT}/getadminjobs`, {
          withCredentials: true
        });
        
        if (jobsResponse.data.status) {
          setPostedJobs(jobsResponse.data.jobs || []);
        }
        
        // Fetch recent applications (if any)
        // This would need a separate endpoint for recruiter's applications
        setRecentApplications([]);
        
      } catch (error) {
        console.error('Error fetching recruiter data:', error);
        toast.error('Failed to load recruiter data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'Recruiter') {
      fetchRecruiterData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-vh-100 bg-light">
        <Navbar />
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading recruiter profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-md-12">
            {/* Profile Header Card */}
            <div className="card shadow-lg border-0 mb-4">
              <div className="card-body p-5">
                <div className="row align-items-center">
                  <div className="col-md-3 text-center mb-4 mb-md-0">
                    <div className="position-relative d-inline-block">
                      <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" 
                           style={{width: '120px', height: '120px'}}>
                        {user?.profile?.profilePhoto ? (
                          <img 
                            src={getProfilePhotoUrl(user?.profile?.profilePhoto)} 
                            alt="Profile" 
                            className="rounded-circle img-fluid"
                            style={{width: '120px', height: '120px', objectFit: 'cover'}}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const iconDiv = e.target.parentElement.querySelector('.profile-icon');
                              if (iconDiv) iconDiv.style.display = 'flex';
                            }}
                            onLoad={(e) => {
                              const iconDiv = e.target.parentElement.querySelector('.profile-icon');
                              if (iconDiv) iconDiv.style.display = 'none';
                            }}
                          />
                        ) : null}
                        <div 
                          className="d-flex align-items-center justify-content-center w-100 h-100 profile-icon"
                          style={{
                            fontSize: '3rem',
                            color: '#0d6efd',
                            display: (user?.profile?.profilePhoto && user.profile.profilePhoto.trim() !== "") ? 'none' : 'flex',
                            position: 'absolute',
                            top: 0,
                            left: 0
                          }}
                        >
                          <i className="bi bi-person"></i>
                        </div>
                      </div>
                      <button 
                        className="btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle"
                        onClick={() => setOpen(true)}
                        style={{width: '35px', height: '35px'}}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-md-9">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h1 className="display-6 fw-bold text-dark mb-2">{user?.fullname}</h1>
                        <p className="lead text-muted mb-3">
                          {user?.profile?.bio || "Experienced recruiter helping companies find the best talent"}
                        </p>
                        <div className="d-flex flex-wrap gap-2">
                          <span className="badge bg-primary fs-6 px-3 py-2">
                            <i className="bi bi-person-badge me-2"></i>
                            {user?.role}
                          </span>
                          <span className="badge bg-success fs-6 px-3 py-2">
                            <i className="bi bi-building me-2"></i>
                            {postedJobs.length} Jobs Posted
                          </span>
                          <span className="badge bg-info fs-6 px-3 py-2">
                            <i className="bi bi-people me-2"></i>
                            {recentApplications.length} Applications
                          </span>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => setOpen(true)}
                        className="btn btn-outline-primary btn-lg"
                        variant="outline"
                      >
                        <i className="bi bi-pencil me-2"></i>
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-transparent border-0 pb-0">
                <h4 className="fw-bold text-dark mb-0">
                  <i className="bi bi-info-circle text-primary me-2"></i>
                  Contact Information
                </h4>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 bg-light rounded">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                        <i className="bi bi-envelope text-primary fs-5"></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Email</small>
                        <a href={`mailto:${user?.email}`} className="text-decoration-none fw-semibold text-dark">
                          {user?.email}
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 bg-light rounded">
                      <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                        <i className="bi bi-telephone text-success fs-5"></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Phone</small>
                        <a href={`tel:${user?.phoneNumber}`} className="text-decoration-none fw-semibold text-dark">
                          {user?.phoneNumber || "Not provided"}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Posted Jobs Section */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-transparent border-0 pb-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="fw-bold text-dark mb-0">
                    <i className="bi bi-briefcase text-primary me-2"></i>
                    Posted Jobs
                  </h4>
                  <Link to="/admin/jobs/create" className="btn btn-primary btn-sm">
                    <i className="bi bi-plus-circle me-2"></i>
                    Post New Job
                  </Link>
                </div>
              </div>
              <div className="card-body">
                {postedJobs.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Job Title</th>
                          <th>Location</th>
                          <th>Type</th>
                          <th>Salary</th>
                          <th>Applications</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {postedJobs.map((job) => (
                          <tr key={job._id}>
                            <td>
                              <div className="fw-semibold">{job.title}</div>
                              <small className="text-muted">
                                {job.company?.name || 'Company not set'}
                              </small>
                            </td>
                            <td>{job.location}</td>
                            <td>
                              <Badge className={job.jobType === 'Full-time' ? 'bg-success' : 'bg-warning'}>
                                {job.jobType}
                              </Badge>
                            </td>
                            <td>{job.salary}</td>
                            <td>
                              <span className="badge bg-info">
                                {job.applications?.length || 0}
                              </span>
                            </td>
                            <td>
                              <Badge className="bg-success">
                                Active
                              </Badge>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <Link 
                                  to={`/admin/jobs/${job._id}/applicants`}
                                  className="btn btn-outline-primary"
                                  title="View Applications"
                                >
                                  <i className="bi bi-people"></i>
                                </Link>
                                <Link 
                                  to={`/admin/jobs/${job._id}/edit`}
                                  className="btn btn-outline-secondary" 
                                  title="Edit Job"
                                >
                                  <i className="bi bi-pencil"></i>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-briefcase text-muted" style={{fontSize: '2rem'}}></i>
                    <p className="text-muted mt-2">No jobs posted yet</p>
                    <Link to="/admin/jobs/create" className="btn btn-primary btn-sm">
                      Post Your First Job
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Applications Section */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-transparent border-0 pb-0">
                <h4 className="fw-bold text-dark mb-0">
                  <i className="bi bi-file-earmark-person text-primary me-2"></i>
                  Recent Applications
                </h4>
              </div>
              <div className="card-body">
                {recentApplications.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Applicant</th>
                          <th>Job Title</th>
                          <th>Applied Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentApplications.map((application) => (
                          <tr key={application._id}>
                            <td>
                              <div className="fw-semibold">{application.applicantName}</div>
                            </td>
                            <td>{application.jobTitle}</td>
                            <td>{new Date(application.appliedDate).toLocaleDateString()}</td>
                            <td>
                              <Badge className={
                                application.status === 'Shortlisted' ? 'bg-success' :
                                application.status === 'Under Review' ? 'bg-warning' :
                                'bg-danger'
                              }>
                                {application.status}
                              </Badge>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <Link 
                                  to={`/admin/applications/${application._id}`}
                                  className="btn btn-outline-primary"
                                  title="View Details"
                                >
                                  <i className="bi bi-eye"></i>
                                </Link>
                                <button className="btn btn-outline-success" title="Download Resume">
                                  <i className="bi bi-download"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-file-earmark-person text-muted" style={{fontSize: '2rem'}}></i>
                    <p className="text-muted mt-2">No applications received yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Company Information Card */}
            <div className="card shadow-sm border-0">
              <div className="card-header bg-transparent border-0 pb-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="fw-bold text-dark mb-0">
                    <i className="bi bi-building text-primary me-2"></i>
                    Company Information
                  </h4>
                  <Link to="/admin/companies" className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-gear me-2"></i>
                    Manage Companies
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 bg-light rounded">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                        <i className="bi bi-building text-primary fs-5"></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Company</small>
                        <div className="fw-semibold text-dark">Tech Solutions Inc.</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 bg-light rounded">
                      <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                        <i className="bi bi-geo-alt text-success fs-5"></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Location</small>
                        <div className="fw-semibold text-dark">Mumbai, India</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default RecruiterProfile;
