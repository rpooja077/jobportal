import React, { useEffect, useState } from "react";
import ApplicantsTable from "./ApplicantsTable";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "@/redux/applicationSlice";
import { APPLICATION_API_ENDPOINT } from "@/utils/data";
import Navbar from "../components_lite/Navbar";

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllApplicants = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('🔍 Fetching applicants for job ID:', params.id);
        console.log('🌐 API endpoint:', `${APPLICATION_API_ENDPOINT}/${params.id}/applicants`);
        
        const res = await axios.get(
          `${APPLICATION_API_ENDPOINT}/${params.id}/applicants`,
          { withCredentials: true }
        );
        
        console.log('📡 API response:', res.data);
        
        if (res.data.success) {
          dispatch(setAllApplicants(res.data.job));
        } else {
          setError(res.data.message || "Failed to fetch applicants");
        }
      } catch (error) {
        console.error('❌ Error fetching applicants:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        if (error.response?.status === 404) {
          setError("Job not found. It may have been deleted or the ID is invalid.");
        } else if (error.response?.status === 400) {
          const errorMessage = error.response.data.message || "Invalid request. Please check the job ID.";
          if (errorMessage.includes("Invalid job ID format")) {
            setError("Invalid job ID format. Please make sure you're accessing a valid job.");
          } else {
            setError(errorMessage);
          }
        } else if (error.response?.status === 500) {
          setError("Server error. Please try again later or contact support.");
        } else {
          setError(error.response?.data?.message || "Failed to fetch applicants. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAllApplicants();
  }, [params.id, dispatch]);

  if (loading) {
    return (
      <div className="min-vh-100 bg-light">
        <Navbar />
        <div className="container py-5">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading applicants...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 bg-light">
        <Navbar />
        <div className="container py-5">
          <div className="text-center py-5">
            <div className="w-25 h-25 bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4">
              <i className="bi bi-exclamation-triangle text-danger fs-1"></i>
            </div>
            <h3 className="h4 fw-bold text-dark mb-3">Error Loading Applicants</h3>
            <p className="text-muted mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const applicantCount = applicants?.applications?.length || 0;
  const jobTitle = applicants?.title || "Job";
  const companyName = applicants?.company?.name || "Company";

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container py-5">
        {/* Header Section */}
        <div className="card shadow-lg border-0 mb-4">
          <div className="card-body p-5">
            <div className="d-flex align-items-center gap-4 mb-4">
              <div className="w-25 h-25 bg-primary bg-gradient rounded-circle d-flex align-items-center justify-content-center">
                <i className="bi bi-people text-white fs-1"></i>
              </div>
              <div>
                <h1 className="display-6 fw-bold text-dark mb-2">Job Applicants</h1>
                <p className="lead text-muted mb-0">
                  Managing applications for <span className="fw-semibold text-primary">{jobTitle}</span> at <span className="fw-semibold text-info">{companyName}</span>
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-4">
              <div className="col-md-4">
                <div className="card bg-primary bg-opacity-10 border-primary border-opacity-25">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-circle d-flex align-items-center justify-content-center">
                        <i className="bi bi-people text-white"></i>
                      </div>
                      <div>
                        <p className="small text-primary fw-medium mb-1">Total Applicants</p>
                        <p className="h3 fw-bold text-primary mb-0">{applicantCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card bg-success bg-opacity-10 border-success border-opacity-25">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="w-10 h-10 bg-success rounded-circle d-flex align-items-center justify-content-center">
                        <i className="bi bi-file-earmark-text text-white"></i>
                      </div>
                      <div>
                        <p className="small text-success fw-medium mb-1">Resumes Available</p>
                        <p className="h3 fw-bold text-success mb-0">
                          {applicants?.applications?.filter(app => app.applicant?.profile?.resume).length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card bg-info bg-opacity-10 border-info border-opacity-25">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="w-10 h-10 bg-info rounded-circle d-flex align-items-center justify-content-center">
                        <i className="bi bi-calendar text-white"></i>
                      </div>
                      <div>
                        <p className="small text-info fw-medium mb-1">Posted Date</p>
                        <p className="h5 fw-bold text-info mb-0">
                          {applicants?.createdAt ? 
                            new Date(applicants.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : "N/A"
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Applicants Table */}
        <div className="card shadow-lg border-0">
          <div className="card-header bg-white border-bottom">
            <h2 className="h4 fw-semibold text-dark mb-1">Applicant Details</h2>
            <p className="text-muted mb-0">
              Review and manage all applications for this position
            </p>
          </div>
          <div className="card-body p-0">
            <ApplicantsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applicants;
