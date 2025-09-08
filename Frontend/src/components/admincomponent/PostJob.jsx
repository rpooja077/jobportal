import React, { useState, useEffect } from "react";
import Navbar from "../components_lite/Navbar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import store from "@/redux/store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const companyArray = [];

const PostJob = () => {
  const { id } = useParams(); // Get job ID from URL for edit mode
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  
  // Check if we're in edit mode and load job data
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      loadJobData();
    }
  }, [id]);

  const loadJobData = async () => {
    try {
      setInitialLoading(true);
      const response = await axios.get(`${JOB_API_ENDPOINT}/get/${id}`, {
        withCredentials: true
      });
      
      if (response.data.status && response.data.job) {
        const job = response.data.job;
        setInput({
          title: job.title || "",
          description: job.description || "",
          requirements: Array.isArray(job.requirements) ? job.requirements.join(", ") : job.requirements || "",
          salary: job.salary?.toString() || "",
          location: job.location || "",
          jobType: job.jobType || "",
          experience: job.experienceLevel || "",
          position: job.position || 0,
          companyId: job.company?._id || "",
        });
      }
    } catch (error) {
      console.error('Error loading job data:', error);
      toast.error('Failed to load job data');
      navigate('/admin/jobs');
    } finally {
      setInitialLoading(false);
    }
  };
  
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  
  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    setInput({ ...input, companyId: selectedCompany._id });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!input.title.trim() || !input.description.trim() || !input.location.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setLoading(true);
      
      if (isEditMode) {
        // Update existing job
        const res = await axios.put(`${JOB_API_ENDPOINT}/update/${id}`, input, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        
        if (res.data.status) {
          toast.success("Job updated successfully!");
          navigate("/admin/jobs");
        } else {
          toast.error(res.data.message || "Failed to update job");
        }
      } else {
        // Create new job
        const res = await axios.post(`${JOB_API_ENDPOINT}/post`, input, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        
        if (res.data.status) {
          toast.success(res.data.message);
          navigate("/admin/jobs");
        } else {
          toast.error(res.data.message || "Failed to create job");
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Something went wrong");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-vh-100 bg-light">
        <Navbar />
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading job data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Header Card */}
            <div className="card shadow-lg border-0 mb-4">
              <div className="card-body text-center p-5">
                <div className="w-25 h-25 bg-primary bg-gradient rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4">
                  <i className="bi bi-briefcase text-white fs-1"></i>
                </div>
                <h1 className="display-5 fw-bold text-dark mb-3">
                  {isEditMode ? "Edit Job" : "Post New Job"}
                </h1>
                <p className="lead text-muted">Create a compelling job posting to attract top talent</p>
              </div>
            </div>

            {/* Form Card */}
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <form onSubmit={submitHandler}>
                  {/* Job Basic Info */}
                  <div className="mb-5">
                    <h2 className="h4 fw-semibold text-dark border-bottom pb-3 mb-4">
                      <i className="bi bi-briefcase text-primary me-2"></i>
                      Job Details
                    </h2>
                    
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <Label className="form-label fw-semibold text-dark">
                            Job Title <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="title"
                            value={input.title}
                            placeholder="e.g., Senior React Developer"
                            className="form-control form-control-lg"
                            onChange={changeEventHandler}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <Label className="form-label fw-semibold text-dark">
                            Location <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="location"
                            value={input.location}
                            placeholder="e.g., Remote, New York, London"
                            className="form-control form-control-lg"
                            onChange={changeEventHandler}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <Label className="form-label fw-semibold text-dark">
                            Salary (LPA)
                          </Label>
                          <Input
                            type="number"
                            name="salary"
                            value={input.salary}
                            placeholder="e.g., 15"
                            className="form-control form-control-lg"
                            onChange={changeEventHandler}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <Label className="form-label fw-semibold text-dark">
                            Number of Positions
                          </Label>
                          <Input
                            type="number"
                            name="position"
                            value={input.position}
                            placeholder="e.g., 2"
                            className="form-control form-control-lg"
                            onChange={changeEventHandler}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <Label className="form-label fw-semibold text-dark">
                            Experience (Years)
                          </Label>
                          <Input
                            type="number"
                            name="experience"
                            value={input.experience}
                            placeholder="e.g., 3"
                            className="form-control form-control-lg"
                            onChange={changeEventHandler}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <Label className="form-label fw-semibold text-dark">
                            Job Type
                          </Label>
                          <Input
                            type="text"
                            name="jobType"
                            value={input.jobType}
                            placeholder="e.g., Full-time, Part-time, Contract"
                            className="form-control form-control-lg"
                            onChange={changeEventHandler}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Job Description */}
                  <div className="mb-5">
                    <h2 className="h4 fw-semibold text-dark border-bottom pb-3 mb-4">
                      <i className="bi bi-file-earmark-text text-success me-2"></i>
                      Job Description
                    </h2>
                    
                    <div className="mb-4">
                      <Label className="form-label fw-semibold text-dark">
                        Description <span className="text-danger">*</span>
                      </Label>
                      <textarea
                        name="description"
                        value={input.description}
                        placeholder="Provide a detailed description of the role, responsibilities, and what makes this position exciting..."
                        className="form-control"
                        rows="6"
                        onChange={changeEventHandler}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <Label className="form-label fw-semibold text-dark">
                        Requirements
                      </Label>
                      <textarea
                        name="requirements"
                        value={input.requirements}
                        placeholder="List the key skills, qualifications, and experience required for this position..."
                        className="form-control"
                        rows="4"
                        onChange={changeEventHandler}
                      />
                    </div>
                  </div>

                  {/* Company Selection */}
                  <div className="mb-5">
                    <h2 className="h4 fw-semibold text-dark border-bottom pb-3 mb-4">
                      <i className="bi bi-building text-info me-2"></i>
                      Company Assignment
                    </h2>
                    
                    {companies.length > 0 ? (
                      <div className="mb-3">
                        <Label className="form-label fw-semibold text-dark">
                          Select Company <span className="text-danger">*</span>
                        </Label>
                        <Select onValueChange={selectChangeHandler} required>
                          <SelectTrigger className="form-control form-control-lg">
                            <SelectValue placeholder="Choose a company to post this job for..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {companies.map((company) => (
                                <SelectItem
                                  key={company._id}
                                  value={company.name.toLowerCase()}
                                >
                                  {company.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="alert alert-danger">
                        <div className="d-flex align-items-center gap-3">
                          <div className="w-8 h-8 bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                            <i className="bi bi-building text-danger small"></i>
                          </div>
                          <div>
                            <h6 className="fw-semibold text-danger mb-1">No Company Registered</h6>
                            <p className="text-danger small mb-0">
                              You need to register a company before posting jobs. 
                              <button 
                                onClick={() => navigate("/admin/companies/create")}
                                className="text-danger text-decoration-underline ms-1 border-0 bg-transparent"
                              >
                                Create Company Now
                              </button>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-top">
                    {loading ? (
                      <Button 
                        disabled 
                        className="btn btn-secondary btn-lg w-100"
                      >
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Posting Job...
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={companies.length === 0}
                        className="btn btn-primary btn-lg w-100"
                      >
                        <i className="bi bi-briefcase me-2"></i>
                        Post Job
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
