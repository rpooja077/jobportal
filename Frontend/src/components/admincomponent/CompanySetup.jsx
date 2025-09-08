import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components_lite/Navbar.jsx";
import { Button } from "../ui/button.jsx";
import { Label } from "../ui/label.jsx";
import { Input } from "../ui/input.jsx";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "../../utils/data.js";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById.jsx";

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });
  const { singleCompany } = useSelector((store) => store.company);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = useCallback((e) => {
    setInput(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const changeFileHandler = useCallback((e) => {
    const file = e.target.files?.[0];
    setInput(prev => ({ ...prev, file }));
  }, []);

  const submitHandler = useCallback(async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (loading) {
      console.log('⚠️ Form submission already in progress, ignoring duplicate call');
      return;
    }
    
    // Basic validation
    if (!input.name.trim()) {
      toast.error("Company name is required");
      return;
    }
    
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) {
      formData.append("file", input.file);
    }
    
    try {
      setLoading(true);
      console.log('🚀 Submitting company update...');
      
      const res = await axios.put(
        `${COMPANY_API_ENDPOINT}/update/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.status === 200 && res.data.success) {
        console.log('✅ Company update successful');
        toast.success(res.data.message || "Company updated successfully!");
        // Small delay before navigation to ensure toast is visible
        setTimeout(() => {
          navigate("/admin/companies");
        }, 1000);
      } else {
        throw new Error("Unexpected API response.");
      }
    } catch (error) {
      console.error('❌ Company update error:', error);
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [input.name, input.description, input.website, input.location, input.file, params.id, navigate, loading]);

  useEffect(() => {
    if (singleCompany && singleCompany._id && !input.name) {
      setInput(prev => ({
        ...prev,
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
      }));
    }
  }, [singleCompany]);

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header Card */}
            <div className="card shadow-lg border-0 mb-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-3">
                  <Button
                    onClick={() => navigate("/admin/companies")}
                    variant="outline"
                    className="btn btn-outline-secondary"
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Companies
                  </Button>
                  <div>
                    <h1 className="h3 fw-bold text-dark mb-1">Company Setup</h1>
                    <p className="text-muted mb-0">Update your company profile and details</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <form onSubmit={submitHandler}>
                  {/* Company Logo Preview */}
                  {singleCompany?.logo && (
                    <div className="text-center mb-4">
                      <div className="d-inline-block position-relative">
                        <img
                          src={singleCompany.logo}
                          alt="Company Logo"
                          className="rounded-circle"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        <div className="position-absolute top-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                             style={{ width: '30px', height: '30px' }}>
                          <i className="bi bi-building small"></i>
                        </div>
                      </div>
                      <p className="text-muted small mt-2">Current company logo</p>
                    </div>
                  )}

                  {/* Company Information */}
                  <div className="mb-4">
                    <h4 className="fw-semibold text-dark border-bottom pb-3 mb-4">
                      <i className="bi bi-building text-primary me-2"></i>
                      Company Information
                    </h4>
                    
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <Label className="form-label fw-semibold text-dark">
                            Company Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="name"
                            value={input.name}
                            placeholder="Enter company name..."
                            className="form-control form-control-lg"
                            onChange={changeEventHandler}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <Label className="form-label fw-semibold text-dark">
                            Location
                          </Label>
                          <Input
                            type="text"
                            name="location"
                            value={input.location}
                            placeholder="e.g., Mumbai, India"
                            className="form-control form-control-lg"
                            onChange={changeEventHandler}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <Label className="form-label fw-semibold text-dark">
                            Website
                          </Label>
                          <Input
                            type="url"
                            name="website"
                            value={input.website}
                            placeholder="https://www.company.com"
                            className="form-control form-control-lg"
                            onChange={changeEventHandler}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <Label className="form-label fw-semibold text-dark">
                            Company Logo
                          </Label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={changeFileHandler}
                            className="form-control form-control-lg"
                          />
                          <div className="form-text">
                            Upload a square logo (recommended: 512x512px)
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <Label className="form-label fw-semibold text-dark">
                        Company Description
                      </Label>
                      <textarea
                        name="description"
                        value={input.description}
                        placeholder="Tell us about your company, culture, mission, and what makes you unique..."
                        className="form-control"
                        rows="4"
                        onChange={changeEventHandler}
                      />
                      <div className="form-text">
                        This description will be visible to job seekers
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-3 pt-4 border-top">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/admin/companies")}
                      className="btn btn-outline-secondary btn-lg flex-fill"
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={loading || !input.name.trim()}
                      className="btn btn-primary btn-lg flex-fill"
                      onClick={(e) => {
                        // Prevent double-click submissions
                        if (loading) {
                          e.preventDefault();
                          return;
                        }
                      }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Update Company
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Info Card */}
            <div className="card bg-info bg-opacity-10 border-info border-opacity-25 mt-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="w-6 h-6 bg-info rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1">
                    <i className="bi bi-info-circle text-white small"></i>
                  </div>
                  <div>
                    <h5 className="fw-semibold text-info mb-2">Why update your company profile?</h5>
                    <ul className="text-info mb-0 small">
                      <li>• Attract better candidates with detailed company information</li>
                      <li>• Build trust with a professional company logo</li>
                      <li>• Improve your company's visibility in job searches</li>
                      <li>• Showcase your company culture and values</li>
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

export default CompanySetup;
