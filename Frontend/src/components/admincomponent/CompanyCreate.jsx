import React, { useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { COMPANY_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companyslice";
import axios from "axios";

const CompanyCreate = () => {
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const registerNewCompany = async () => {
    if (!companyName.trim()) {
      toast.error("Please enter a company name");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${COMPANY_API_ENDPOINT}/register`,
        { companyName },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      
      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        const companyId = res?.data?.company?._id;
        navigate(`/admin/companies/${companyId}`);
      } else {
        toast.error(res.data.message || "Failed to create company");
      }
    } catch (error) {
      console.error("Company creation error:", error);
      
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || "Failed to create company";
        toast.error(errorMessage);
        
        // Handle specific error cases
        if (error.response.status === 401) {
          toast.error("Please login again to create a company");
        } else if (error.response.status === 400) {
          // Already handled by the error message above
        }
      } else if (error.request) {
        // Network error
        toast.error("Network error. Please check your connection and try again.");
      } else {
        // Other error
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header Card */}
            <div className="card shadow-lg border-0 mb-4">
              <div className="card-body text-center p-5">
                <div className="w-25 h-25 bg-primary bg-gradient rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4">
                  <i className="bi bi-building text-white fs-1"></i>
                </div>
                <h1 className="display-5 fw-bold text-dark mb-3">Create New Company</h1>
                <p className="lead text-muted">Set up your company profile to start posting jobs</p>
              </div>
            </div>

            {/* Form Card */}
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="mb-4">
                  <Label className="form-label fw-semibold text-dark">
                    Company Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter your company name..."
                    className="form-control form-control-lg border-2"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && registerNewCompany()}
                  />
                  <div className="form-text">
                    This will be the name displayed to job seekers
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-3 pt-4 border-top">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/admin/companies")}
                    className="btn btn-outline-secondary btn-lg flex-fill"
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Cancel
                  </Button>
                  <Button 
                    onClick={registerNewCompany}
                    disabled={isLoading || !companyName.trim()}
                    className="btn btn-primary btn-lg flex-fill"
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Create Company
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="card bg-primary bg-opacity-10 border-primary border-opacity-25 mt-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1">
                    <i className="bi bi-info-circle text-white small"></i>
                  </div>
                  <div>
                    <h5 className="fw-semibold text-primary mb-2">What happens next?</h5>
                    <ul className="text-primary mb-0 small">
                      <li>• Your company profile will be created</li>
                      <li>• You can add company details and logo</li>
                      <li>• Start posting job opportunities</li>
                      <li>• Manage applications and candidates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Troubleshooting Card */}
            <div className="card bg-warning bg-opacity-10 border-warning border-opacity-25 mt-3">
              <div className="card-body p-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="w-6 h-6 bg-warning rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1">
                    <i className="bi bi-exclamation-triangle text-white small"></i>
                  </div>
                  <div>
                    <h5 className="fw-semibold text-warning mb-2">Having trouble?</h5>
                    <ul className="text-warning mb-0 small">
                      <li>• Make sure you're logged in as a recruiter</li>
                      <li>• Company name must be unique (not already taken)</li>
                      <li>• You can create up to 10 companies per account</li>
                      <li>• If issues persist, try refreshing the page</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
