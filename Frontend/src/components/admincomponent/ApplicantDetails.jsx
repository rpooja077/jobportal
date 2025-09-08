import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "../components_lite/Navbar";
import { APPLICATION_API_ENDPOINT } from "@/utils/data";

const ApplicantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [application, setApplication] = useState(null);

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching application details for ID:', id);
      console.log('🌐 API endpoint:', `${APPLICATION_API_ENDPOINT}/applicant/${id}`);
      
      const res = await axios.get(`${APPLICATION_API_ENDPOINT}/applicant/${id}`, {
        withCredentials: true,
      });
      
      console.log('📡 API response:', res.data);
      
      if (res.data.success) {
        setApplication(res.data.application);
      } else {
        setError(res.data.message || "Failed to load details");
      }
    } catch (err) {
      console.error('❌ Error fetching application details:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      if (err.response?.status === 404) {
        setError("Application not found. It may have been deleted or the ID is invalid.");
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || "Invalid request. Please check the application ID.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later or contact support.");
      } else {
        setError(err.response?.data?.message || "Failed to load details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const updateStatus = async (nextStatus) => {
    try {
      const prev = application;
      setApplication({ ...application, status: nextStatus.toLowerCase() });
      const res = await axios.post(
        `${APPLICATION_API_ENDPOINT}/status/${id}/update`,
        { status: nextStatus },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Application status updated");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
      // revert optimistic update
      await fetchDetails();
    }
  };

  const openResume = (url, fileName) => {
    if (!url) {
      toast.error("No resume available");
      return;
    }
    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      toast.error("Failed to open resume");
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light">
        <Navbar />
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 bg-light">
        <Navbar />
        <div className="container py-5 text-center">
          <h3 className="h4 fw-bold text-dark mb-3">Error</h3>
          <p className="text-muted mb-4">{error}</p>
          <button className="btn btn-primary" onClick={fetchDetails}>Retry</button>
        </div>
      </div>
    );
  }

  const applicant = application?.applicant;
  const job = application?.job;
  const resumeUrl = applicant?.profile?.resume;
  const resumeFileName = applicant?.profile?.resumeOriginalname;

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container py-5">
        <div className="d-flex align-items-center mb-4">
          <button className="btn btn-link me-2" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i>
          </button>
          <h1 className="h3 fw-bold mb-0">Application Details</h1>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h5 className="fw-semibold mb-3">Applicant</h5>
                <div className="mb-3">
                  <div className="fw-bold">{applicant?.fullname}</div>
                  <div className="text-muted">{applicant?.email}</div>
                  <div className="text-muted">{applicant?.phoneNumber || 'N/A'}</div>
                </div>
                <h6 className="fw-semibold mb-2">Resume</h6>
                {resumeUrl ? (
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm" onClick={() => openResume(resumeUrl, resumeFileName)}>
                      <i className="bi bi-eye me-1"></i> View
                    </button>
                    <a className="btn btn-outline-success btn-sm" href={(resumeUrl && resumeUrl.includes('http://localhost:4000/resume/')) ? resumeUrl.replace('/resume/','/download/') : (resumeUrl ? (resumeUrl.includes('?') ? `${resumeUrl}&fl_attachment=${encodeURIComponent(resumeFileName || 'resume.pdf')}` : `${resumeUrl}?fl_attachment=${encodeURIComponent(resumeFileName || 'resume.pdf')}`) : '#')} target="_blank" rel="noreferrer" download>
                      <i className="bi bi-download me-1"></i> Download
                    </a>
                  </div>
                ) : (
                  <span className="badge bg-warning text-dark">No resume</span>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h6 className="fw-semibold mb-2">Job</h6>
                <div className="mb-3">
                  <div className="fw-bold">{job?.title}</div>
                  <div className="text-muted">{job?.company?.name}</div>
                </div>
                <h6 className="fw-semibold mb-2">Status</h6>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className={`badge ${application?.status === 'pending' ? 'bg-warning' : application?.status === 'accepted' ? 'bg-success' : 'bg-danger'} text-white`}>
                    {application?.status?.charAt(0).toUpperCase() + application?.status?.slice(1)}
                  </span>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-success btn-sm" onClick={() => updateStatus('Accepted')} disabled={application?.status === 'accepted'}>
                    <i className="bi bi-check-circle me-1"></i> Accept
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => updateStatus('Rejected')} disabled={application?.status === 'rejected'}>
                    <i className="bi bi-x-circle me-1"></i> Reject
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

export default ApplicantDetails;


